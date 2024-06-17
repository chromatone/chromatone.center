
import { computed, onMounted, reactive, onBeforeUnmount, watch } from "vue";

import { synth as AppSynth, midi } from "./";

let synth

export function useZZFX() {

  const sound = reactive({
    volume: 1,
    randomness: 0,
    frequency: 220,
    attack: 0.12,
    sustain: 0.53,
    release: 0.15,
    shape: 1,
    shapeCurve: 0.76,
    slide: 0,
    deltaSlide: 0,
    pitchJump: 0,
    pitchJumpTime: 0,
    repeatTime: 0,
    noise: 0.1,
    modulation: 0,
    bitCrush: 0,
    delay: 0,
    sustainVolume: 0.39,
    decay: 0.02,
    tremolo: 0
  });

  const soundArray = computed(() => prepareParams(sound))

  onMounted(() => {
    ZZFX.volume = 0.3;
    AppSynth.state.midi = false
  });

  onBeforeUnmount(() => {
    AppSynth.state.midi = true
  })

  watch(() => midi.note, n => {
    play(n)
  })


  const limits = {
    volume: { min: 0, max: 1, default: 1, step: 0.01 },
    randomness: { min: 0, max: 1, default: 0.05, step: 0.01 },
    frequency: { min: 20, max: 20000, default: 220, step: 10 },
    attack: { min: 0, max: 2, default: 0.01, step: 0.01 },
    sustain: { min: 0, max: 2, default: 0.3, step: 0.01 },
    release: { min: 0, max: 2, default: 0.1, step: 0.01 },
    shape: { min: 0, max: 4, default: 0, step: 1 },
    shapeCurve: { min: 0, max: 2, default: 1, step: 0.01 },
    slide: { min: -10, max: 10, default: 0, step: 0.1 },
    deltaSlide: { min: -10, max: 10, default: 0, step: 0.1 },
    pitchJump: { min: -10, max: 10, default: 0, step: 0.1 },
    pitchJumpTime: { min: 0, max: 2, default: 0, step: 0.01 },
    repeatTime: { min: 0, max: 2, default: 0, step: 0.01 },
    noise: { min: 0, max: 1, default: 0, step: 0.01 },
    modulation: { min: 0, max: 100, default: 0, step: 1 },
    bitCrush: { min: 0, max: 1, default: 0, step: 0.01 },
    delay: { min: 0, max: 2, default: 0, step: 0.01 },
    sustainVolume: { min: 0, max: 1, default: 1, step: 0.01 },
    decay: { min: 0, max: 2, default: 0.1, step: 0.01 },
    tremolo: { min: 0, max: 1, default: 0, step: 0.01 }
  };

  function randomize() {
    Object.keys(sound).forEach(c => {
      if (['volume', "randomness", "frequency"].includes(c)) return
      sound[c] = random(limits[c].min, limits[c].max)
    })
  }

  function random(min, max) {
    min = (typeof min !== "undefined") ? min : 0;
    max = (typeof max !== "undefined") ? max : 1;
    return min + Math.random() * (max - min);
  };

  async function play(note) {
    if (note?.type == 'noteoff') return
    if (note?.type == 'noteon') sound.frequency = Math.pow(2, (note.number - 69) / 12) * 440;
    if (!synth) {
      await import('zzfx').then(({ zzfx }) => {
        synth = zzfx
      })
    }

    synth(...soundArray.value)
  }

  function prepareParams(exp) {
    return [
      exp.volume ?? 1, // volume
      exp.randomness ?? 0.05, // randomness
      exp.frequency ?? 220, // frequency
      exp.attack ?? 0, // attack
      exp.sustain ?? 0, // sustain
      exp.release ?? 0.1, // release
      exp.shape ?? 0, // shape
      exp.shapeCurve ?? 1, // shapeCurve
      exp.slide ?? 0, // slide
      exp.deltaSlide ?? 0, // deltaSlide
      exp.pitchJump ?? 0, // pitchJump
      exp.pitchJumpTime ?? 0, // pitchJumpTime
      exp.repeatTime ?? 0, // repeatTime
      exp.noise ?? 0, // noise
      exp.modulation ?? 0, // modulation
      exp.bitCrush ?? 0, // bitCrush
      exp.delay ?? 0, // delay
      exp.sustainVolume ?? 1, // sustainVolume
      exp.decay ?? 0, // decay
      exp.tremolo ?? 0, // tremolo
    ];
  }

  return {
    sound, limits
  }

}