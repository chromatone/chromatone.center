/**
 * @module Sequence
 * The beat loops
 */

import { shallowReactive, reactive, computed, watch, watchEffect, onBeforeUnmount } from 'vue'
import { tempo } from "./tempo";
import {
  Sequence,
  PanVol,
  gainToDb,
  getDraw,
  Sampler,
  start,
  Recorder,
  Meter,
  UserMedia,
  getContext,
} from "tone";
import { createChannel } from './audio'
import { rotateArray } from "./calculations";
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';

export const tracks = reactive([]);

export const maxRatio = computed(() => Math.max(...tracks.map(track => track.meter.over / track.meter.under)));

const createStorageKey = (prefix, order, mode, suffix) => `${prefix}-${mode}-${suffix}-${order}`;

export function useSequence(initial = { over: 4, under: 4, sound: "A", volume: 1 }, order = 0, mode = "bar", maxSteps = 64) {
  const storageKey = (suffix) => createStorageKey('tempo-loop', order, mode, suffix);

  const seq = reactive({
    meter: {
      over: useClamp(useStorage(storageKey('over'), 4), 2, maxSteps),
      under: useClamp(useStorage(storageKey('under'), 4), 1, maxSteps),
      sound: useStorage(storageKey('sound'), 'A'),
      volume: useClamp(useStorage(storageKey('volume'), 1), 0, 1),
    },
    current: '0-0',
    steps: [["0-1"], ["1-1"], ["2-1"], ["3-1"]],
    mutes: useStorage(createStorageKey('metro', order, mode, 'mutes'), []),
    accents: useStorage(createStorageKey('metro', order, mode, 'accents'), [true]),
    volume: useClamp(useStorage(createStorageKey('metro', order, mode, 'vol'), initial?.volume || 1), 0, 1),
    mute: false,
    pan: useClamp(useStorage(createStorageKey('metro', order, mode, 'pan'), order % 2 ? -0.5 : 0.5), -1, 1),
    mutesCount: computed(() => seq.mutes.filter(val => !val).length),
    activeSteps: computed(() => seq.steps.filter((step, index) => !seq.mutes[index]).map((step) => Number(step[0].split('-')[0]))),
    currentSeq: computed(() => seq.mutes.map(val => val ? '0' : '1').join('')),
    euclidSeq: computed(() => seq.mutesCount > 0 && seq.mutesCount < seq.steps.length ? getEuclideanRhythm(seq.mutesCount, seq.steps.length).join('') : '1'.repeat(seq.steps.length)),
    isEuclidean: computed(() => seq.euclidSeq === seq.currentSeq),
    reset() {
      seq.mutes = seq.euclidSeq.split('').map(e => e !== '1');
    },
    rotateAccents(num) {
      seq.accents = rotateArray(seq.accents, num);
      seq.mutes = rotateArray(seq.mutes, num);
    }
  });

  tracks[order] = seq;

  seq.progress = computed(() => tempo.ticks ? sequence?.progress : 0);

  let sequence = createSequence();

  watch(() => seq.meter.under, recreateSequence);
  watch(() => seq.meter.over, updateSteps, { immediate: true });
  watchEffect(updateSequenceEvents);
  watchEffect(() => { if (tempo.stopped) seq.current = '1000-1'; });

  const audio = createAudio(order, mode);
  const { sampler, micRec } = useSampler(audio.synth);

  watchAudioSettings();

  function createSequence() {
    return new Sequence(beatClick, seq.steps, `${seq.meter.under}n`).start(0);
  }

  function recreateSequence() {
    sequence?.stop()?.dispose();
    sequence = createSequence();
  }

  function updateSteps() {
    seq.steps = Array.from({ length: seq.meter.over }, (_, i) => [`${i}-1`]);
    sequence.events = seq.steps;
  }

  function updateSequenceEvents() {
    sequence.events = seq.steps;
    seq.accents.length = seq.steps.length;
    seq.mutes.length = seq.steps.length;
    seq.mutes.fill(false, seq.mutes.length);
  }

  function createAudio(order, mode) {
    const audio = shallowReactive({
      ...createChannel(`sequence-${mode}-${order}`),
      panner: new PanVol(order % 2 ? -0.5 : 0.5, 0),
      synth: new Sampler({
        urls: createSoundUrls(),
        volume: 1,
        attack: 0.001,
        release: 2,
        baseUrl: "/audio/metronome/",
      }),
    });

    audio.synth.connect(audio.panner);
    audio.panner.connect(audio.channel);

    return audio;
  }

  function createSoundUrls() {
    const sounds = { A: 'tongue', B: 'synth', C: 'seiko', D: 'ping', E: 'logic' };
    return Object.entries(sounds).reduce((acc, [key, sound]) => {
      acc[`${key}1`] = `${sound}/high.wav`;
      acc[`${key}2`] = `${sound}/low.wav`;
      return acc;
    }, {});
  }

  function watchAudioSettings() {
    watch(() => seq.mute, m => { audio.volume.mute = m; });
    watch(() => seq.meter.sound, sound => {
      if (sound !== "F") {
        sampler.main = false;
        sampler.accent = false;
      }
    });
    watch(() => seq.volume, vol => { audio.panner.volume.targetRampTo(gainToDb(vol), 1); }, { immediate: true });
    watch(() => seq.pan, p => { audio.panner.pan.targetRampTo(p, 1); }, { immediate: true });
  }

  function beatClick(time, step) {
    if (getContext().state === "suspended") {
      start();
    }
    const mainStep = typeof step === "string" ? +step.split("-")[0] : step;
    const Draw = getDraw();
    Draw.schedule(() => { seq.current = step; }, time);

    const accented = seq.accents[mainStep] && step.split("-")[1] === "1";
    if (seq.mutes[mainStep] || seq.mutes[step]) return;
    if (seq.meter.sound === "F" && ((accented && !sampler.accent) || (!accented && !sampler.main))) return;

    const note = `${seq.meter.sound}${accented ? 2 : 1}`;
    audio.synth.triggerAttackRelease(note, `${seq.meter.under}n`, time);
  }

  onBeforeUnmount(() => {
    sequence.stop().dispose();
    [audio, micRec].forEach(c => {
      Object.values(c).forEach(n => n?.dispose?.());
    });
  });

  return { sampler, seq };
}

function useSampler(synth) {
  const micRec = {
    mic: new UserMedia(1),
    meter: new Meter(),
    recorder: new Recorder(),
  };
  micRec.mic.connect(micRec.meter);
  micRec.meter.connect(micRec.recorder);

  const sampler = reactive({
    started: false,
    recording: false,
    main: false,
    accent: false,
    both: computed(() => sampler.main && sampler.accent),
    async load(pos = "main", blob) {
      const arr = await blob.arrayBuffer();
      const buff = await micRec.recorder.context.decodeAudioData(arr);
      synth.add(pos === "main" ? "F1" : "F2", buff);
      sampler[pos] = true;
      sampler.recording = false;
    },
    async rec(pos = "main") {
      if (!sampler.recording) {
        if (!sampler.started) {
          try {
            await micRec.mic.open();
            sampler.started = true;
            sampler.recording = pos;
            micRec.recorder.start();
          } catch (error) {
            console.log("mic not open", error);
          }
        } else {
          sampler.recording = pos;
          micRec.recorder.start();
        }
      } else {
        const blob = await micRec.recorder.stop();
        const arr = await blob.arrayBuffer();
        const buff = await micRec.recorder.context.decodeAudioData(arr);
        synth.add(pos === "main" ? "F1" : "F2", buff);
        sampler[pos] = true;
        sampler.recording = false;
      }
    },
  });

  return { sampler, micRec };
}

function getEuclideanRhythm(x, total) {
  function _getEuclideanRhythm(m, k, input) {
    input = input || Array(m).fill('1').concat(Array(k).fill('0'));
    const output = [];

    for (let i = 0; i < Math.min(m, k); i++) {
      output.push(input.shift() + input.pop());
    }

    return input.length > 1 ? _getEuclideanRhythm(output.length, input.length, output.concat(input)) : output.concat(input);
  }

  return _getEuclideanRhythm(x, total - x, null);
}