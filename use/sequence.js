/**
 * @module Sequence
 * The beat loops
 */

import { shallowReactive, reactive, computed, watch, watchEffect, onBeforeUnmount, markRaw, ref } from 'vue'
import { tempo } from "./tempo";
import { Sequence, PanVol, gainToDb, getDraw, Sampler, start, Recorder, Meter, UserMedia, getContext } from "tone";
import { createAudioChannel } from './audio'
import { rotateArray } from "./calculations";
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';

export const tracks = reactive([]);

export const maxRatio = computed(() => Math.max(...tracks.map(track => track.meter.over / track.meter.under)));

const createStorageKey = (prefix, order, mode, suffix) => `${prefix}-${mode}-${suffix}-${order}`;

export function useSequence(initial = { over: 4, under: 4, sound: "A", volume: 1 }, order = 0, mode = "bar", maxSteps = 64) {

  let sequence

  const storageKey = (suffix) => createStorageKey('tempo-loop', order, mode, suffix);

  const meter = reactive({
    over: useClamp(useStorage(storageKey('over'), 4), 2, maxSteps),
    under: useClamp(useStorage(storageKey('under'), 4), 1, maxSteps),
    sound: useStorage(storageKey('sound'), 'A'),
    volume: useClamp(useStorage(storageKey('volume'), 1), 0, 1),
  })

  const current = ref('0-0')
  const steps = computed(() => Array.from({ length: meter.over }, (_, i) => [`${i}-1`]))
  const mutes = useStorage(createStorageKey('metro', order, mode, 'mutes'), [])
  const accents = useStorage(createStorageKey('metro', order, mode, 'accents'), [true])
  const volume = useClamp(useStorage(createStorageKey('metro', order, mode, 'vol'), initial?.volume || 1), 0, 1)
  const activeSteps = computed(() => steps.value.filter((step, index) => !mutes.value[index]).map((step) => Number(step[0].split('-')[0])))
  const mutesCount = computed(() => mutes.value.filter(val => !val).length)
  const progress = computed(() => tempo.ticks ? sequence?.progress : 0)
  const pan = useClamp(useStorage(createStorageKey('metro', order, mode, 'pan'), order % 2 ? -0.5 : 0.5), -1, 1)
  const currentSeq = computed(() => mutes.value.map(val => val ? '0' : '1').join(''))
  const euclidSeq = computed(() => mutesCount.value > 0 && mutesCount.value < steps.value.length ? getEuclideanRhythm(mutesCount.value, steps.value.length).join('') : '1'.repeat(steps.value.length))
  const mute = ref(false)
  const isEuclidean = computed(() => euclidSeq.value === currentSeq.value)

  tracks[order] = { meter, mutes, accents, steps, reset };

  function reset() {
    mutes.value = euclidSeq.value.split('').map(e => e !== '1');
  }

  function rotateAccents(num) {
    accents.value = rotateArray(accents.value, num);
    mutes.value = rotateArray(mutes.value, num);
  }

  const audio = createAudio(order, mode);
  const { sampler, micRec } = useSampler(audio.synth);
  const Draw = getDraw()

  watch(() => meter.under, () => {
    sequence?.stop()?.dispose();
    sequence = new Sequence(beatClick, steps.value, `${meter.under}n`).start(0);
  }, { immediate: true })
  watch(() => meter.over, () => { sequence.events = steps.value; }, { immediate: true });
  watch(steps, s => {
    sequence.events = s;
    accents.value.length = s.length;
    mutes.value.length = s.length;
    mutes.value.fill(false, mutes.value.length);
  }, { immediate: true });
  watch(() => tempo.stopped, st => { if (st) current.value = '1000-1'; })
  watch(mute, m => { audio.volume.mute = m; });
  watch(() => meter.sound, sound => { if (sound !== "F") { sampler.main = false; sampler.accent = false; } });
  watch(volume, vol => { audio.panner.volume.targetRampTo(gainToDb(vol), 1); }, { immediate: true });
  watch(pan, p => { audio.panner.pan.targetRampTo(p, 1); }, { immediate: true });


  function createAudio(order, mode) {
    const audio = shallowReactive({
      ...createAudioChannel(`sequence-${mode}-${order}`),
      panner: markRaw(new PanVol(order % 2 ? -0.5 : 0.5, 0)),
      synth: markRaw(new Sampler({
        urls: Object.fromEntries(
          Object.entries({ A: 'tongue', B: 'synth', C: 'seiko', D: 'ping', E: 'logic' })
            .flatMap(([key, sound]) => [
              [`${key}1`, `${sound}/high.mp3`],
              [`${key}2`, `${sound}/low.mp3`]
            ])
        ),
        volume: 1,
        attack: 0.001,
        release: 2,
        baseUrl: "/audio/metronome/",
      })),
    });

    audio.synth.connect(audio.panner);
    audio.panner.connect(audio.channel);

    return audio;
  }

  function beatClick(time, step) {
    if (getContext().state === "suspended") { start(); }
    const [mainStep, subStep] = step.split("-").map(Number);

    Draw.schedule(() => { current.value = step }, time);

    if (mutes.value[mainStep] || mutes.value[step]) return;

    const accented = accents.value[mainStep] && subStep === 1;
    if (meter.sound === "F" && ((accented && !sampler.accent) || (!accented && !sampler.main))) return;

    audio.synth.triggerAttackRelease(
      `${meter.sound}${accented ? 2 : 1}`,
      `${meter.under}n`,
      time);
  }

  onBeforeUnmount(() => {
    sequence.stop().dispose();
    [audio, micRec].forEach(c => {
      Object.values(c).forEach(n => n?.dispose?.());
    });
  });

  return { sampler, meter, current, steps, mutes, accents, volume, activeSteps, progress, mutesCount, pan, mute, isEuclidean, rotateAccents, reset };
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