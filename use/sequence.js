/**
 * @module Sequence
 * The beat loops
 */

import { shallowReactive, reactive, computed, watch, watchEffect, onBeforeUnmount, } from 'vue'
import { tempo } from "./tempo";
import {
  Sequence,
  PanVol,
  gainToDb,
  getDraw,
  Sampler,
  context,
  start,
  Recorder,
  Meter,
  UserMedia,
  getContext,
} from "tone";
import { createChannel } from './audio'
import { rotateArray } from "./calculations";
import { useStorage, } from '@vueuse/core';
import { useClamp } from '@vueuse/math';


// List of all sequences
export const tracks = reactive([]);

// Maximum ratio of the meter to scale them accordingly
export const maxRatio = computed(() => {
  let max = 0
  tracks.forEach(track => {
    let ratio = track.meter.over / track.meter.under
    if (ratio > max) {
      max = ratio
    }
  })
  return max
})

export function useSequence(
  initial = {
    over: 4,
    under: 4,
    sound: "A",
    volume: 1,
  },
  order = 0,
  mode = "bar",
  maxSteps = 64
) {

  let sequence

  const seq = reactive({
    meter: {
      over: useClamp(useStorage(`tempo-loop-${order} -${mode}-over`, 4), 2, maxSteps),
      under: useClamp(useStorage(`tempo-loop-${order}-${mode}-under`, 4), 1, maxSteps),
      sound: useStorage(`tempo-loop-${order}-${mode}-sound`, 'A'),
      volume: useClamp(useStorage(`tempo-loop-${order}-${mode}-volume`, 1), 0, 1),
    },

    current: '0-0',

    steps: [["0-1"], ["1-1"], ["2-1"], ["3-1"]],

    mutes: useStorage(`metro-${mode}-mutes-${order}`, []),

    accents: useStorage(`metro-${mode}-accents-${order}`, [true]),

    volume: useClamp(useStorage(`metro-${mode}-vol-${order}`, initial?.volume || 1), 0, 1),

    mute: false,

    pan: useClamp(useStorage(`metro-${mode}-pan-${order}`, order % 2 == 1 ? -0.5 : 0.5), -1, 1),

    mutesCount: computed(() => seq.mutes.reduce((acc, val) => {
      if (!val) { acc++ }
      return acc
    }, 0)),

    activeSteps: computed(() => {
      return seq.steps.filter((step) => !seq.mutes[step[0].split('-')[0]]).map((step) => Number(step[0].split('-')[0]))
    }),

    currentSeq: computed(() => seq.mutes.reduce((acc, val) => val ? acc + '0' : acc + '1', '')),

    euclidSeq: computed(() => seq.mutesCount > 0 && seq.mutesCount < seq.steps.length ? getEuclideanRhythm(seq.mutesCount, seq.steps.length).join('') : new Array(seq.steps.length).fill('1').join('')),

    isEuclidean: computed(() => seq.euclidSeq == seq.currentSeq),

    reset() {
      let arr = []
      seq.euclidSeq.split('').forEach((e, i) => {
        arr[i] = (e != false && e != null) ? false : true
      })
      seq.mutes = arr
    },

    rotateAccents(num) {
      seq.accents = rotateArray(seq.accents, num);
      seq.mutes = rotateArray(seq.mutes, num);
    }

  })



  tracks[order] = seq;

  seq.progress = computed(() => {
    if (tempo.ticks) {
      return sequence?.progress;
    } else {
      return 0;
    }
  });

  watch(
    () => seq?.meter?.under,
    () => {
      sequence?.stop()?.dispose();
      sequence = new Sequence(
        beatClick,
        seq.steps,
        seq.meter.under + "n"
      ).start(0);
    },
    { immediate: true }
  );

  watch(
    () => seq?.meter?.over,
    () => {
      seq.steps.length = 0;
      for (let i = 0; i < seq.meter?.over; i++) {
        seq.steps.push([`${i}-1`]);
      }
      sequence.events = seq.steps;
    },
    { immediate: true }
  );

  /**
   * Updates sequence steps when seq.steps change and it triggers the accents and mutes to follow the steps length. 
   * Mutes are filled with false values - it means these notes will be active.
   */
  watchEffect(() => {

    sequence.events = seq.steps;
    seq.accents.length = seq.steps.length;

    const muteL = seq.mutes.length
    seq.mutes.length = seq.steps.length;
    if (seq.mutes.length < seq.steps.length) {
      seq.mutes.fill(false, muteL)
    }

  });

  watchEffect(() => {
    if (tempo.stopped) {
      seq.current = '1000-1'
    }
  });


  const sounds = {
    A: 'tongue',
    B: 'synth',
    C: 'seiko',
    D: 'ping',
    E: 'logic'
  }

  const urls = {}
  for (let l in sounds) {
    for (let i of [1, 2]) {
      urls[`${l}${i} `] = `${sounds[l]}/${i == 1 ? 'high' : 'low'}.wav`
    }
  }

  const audio = shallowReactive({
    ...createChannel(`sequence-${mode}-${order}`),
    panner: new PanVol(order % 2 == 1 ? -0.5 : 0.5, 0),
    synth: new Sampler({
      urls,
      volume: 1,
      attack: 0.001,
      release: 2,
      baseUrl: "/audio/metronome/",
    }),
  });

  audio.synth.connect(audio.panner);
  audio.panner.connect(audio.channel);

  const { sampler, micRec } = useSampler(audio.synth)


  watch(() => seq.mute, m => {
    audio.volume.mute = m
  })

  watch(
    () => seq.meter.sound,
    (sound) => {
      if (sound != "F") {
        sampler.main = false;
        sampler.accent = false;
      }
    }
  );

  watch(
    () => seq.volume,
    (vol) => {
      audio.panner.volume.targetRampTo(gainToDb(vol), 1);
    },
    { immediate: true }
  );

  watch(
    () => seq.pan,
    (p) => {
      audio.panner.pan.targetRampTo(p, 1);
    },
    { immediate: true }
  );


  function beatClick(time, step) {
    if (getContext().state == "suspended") {
      start();
    }
    let mainStep = typeof step == "string" ? + step.split("-")[0] : step;
    const Draw = getDraw()
    Draw.schedule(() => {
      seq.current = step
    }, time);

    let accented = seq.accents[mainStep] && step.split("-")[1] == "1";
    if (seq.mutes[mainStep]) return;
    if (seq.mutes[step]) return;
    if (seq.meter?.sound == "F" && !accented && !sampler.main) return;
    if (seq.meter?.sound == "F" && accented && !sampler.accent) return;
    let note = `${seq.meter?.sound}${accented ? 2 : 1}`;
    audio.synth.triggerAttackRelease(note, seq.meter?.under + "n", time);
    // midiOnce(notes[order * 2] + 3, { time: '+' + time })
  }

  onBeforeUnmount(() => {
    sequence.stop().dispose();
    [audio, micRec].forEach(c => {
      Object.values(c).forEach(n => n.dispose())
    })

  });

  return {
    sampler,
    seq
  };
}

function useSampler(synth) {
  const micRec = {
    mic: new UserMedia(1),
    meter: new Meter(),
    recorder: new Recorder(),
  }
  micRec.mic.connect(micRec.meter);
  micRec.meter.connect(micRec.recorder);

  const sampler = reactive({
    started: false,
    recording: false,
    main: false,
    accent: false,
    both: computed(() => sampler.main && sampler.accent),
    async load(pos = "main", blob) {
      let arr = await blob.arrayBuffer();
      let buff = await micRec.recorder.context.decodeAudioData(arr);
      synth.add(pos == "main" ? "F1" : "F2", buff);
      sampler[pos] = true;
      sampler.recording = false;
    },
    async rec(pos = "main") {

      if (!sampler.recording) {
        if (!sampler.started) {
          micRec.mic
            .open()
            .then(() => {
              sampler.started = true
              sampler.recording = pos;
              micRec.recorder.start();
            })
            .catch(() => {
              console.log("mic not open");
            });
        } else {
          sampler.recording = pos;
          micRec.recorder.start();
        }

      } else {
        let blob = await micRec.recorder.stop();
        let arr = await blob.arrayBuffer();
        let buff = await micRec.recorder.context.decodeAudioData(arr);
        synth.add(pos == "main" ? "F1" : "F2", buff);
        sampler[pos] = true;
        sampler.recording = false;
      }
    },
  });
  return { sampler, micRec }
}

function _getEuclideanRhythm(m, k, input) {
  input = input || new Array(m).fill('1').concat(new Array(k).fill('0'));
  const output = [];

  for (let i = 0; i < Math.min(m, k); i++) {
    output.push(input.shift() + input.pop());
  }

  if (input.length > 1) {
    return _getEuclideanRhythm(output.length, input.length, output.concat(input));
  }

  return output.concat(input);
}

export function getEuclideanRhythm(x, total) {
  return _getEuclideanRhythm(x, total - x, null);
}