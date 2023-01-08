<script setup>
import ClampedNoise from '../clampedNoise.vue';
import {
  FMSynth,
  gainToDb,
  dbToGain,
  FFT,
  Gain,
  AutoFilter,
  AutoPanner,
  Reverb,
  PanVol,
  Panner,
  Filter
} from "tone";

import { notes } from '#/use/theory'
import { createChannel } from '#/use/audio'


const options = useStorage("ambient-synth-options", {
  oscillator: {
    type: "sawtooth",
  },
  envelope: {
    attack: 1,
    decay: 0.1,
    sustain: 0.9,
    release: 6,
  },
  volume: 1,
  harmonicity: 2
});

const active = ref(false)
const note = ref(0)
const octave = ref(1)

const channel = createChannel('ambient-drone')

const gain = new Gain(options.value.volume).connect(channel)
const filter = new Filter({ type: 'lowpass', frequency: 1500, Q: 0 }).connect(gain)
const reverb = new Reverb(4).connect(filter)
const panner = new Panner(0).connect(reverb)
const synth = new FMSynth(options.value).connect(panner)

const currentNote = useStorage('ambient-synth-note', 0)

watch(active, a => {
  if (a) {
    synth.triggerAttack(notes[note.value] + octave.value)
    currentNote.value = note.value
  } else {
    synth.triggerRelease()
  }
})

watch(note, n => {
  synth.frequency.rampTo(notes[n] + octave.value, 1)
})

</script>

<template lang='pug'>
.flex.flex-col.gap-4
  .flex.items-center.flex-wrap
    .font-bold Bass
    button.p-2(@click="active = !active")
      la-play(v-if="!active")
      la-pause(v-else)
    .flex.flex-wrap.gap-2
      button.p-1.text-xs(v-for="(n, i) in notes" :key="n" @click="note = i" :class="{ active: i == note }") {{ n }}
  .flex.flex-wrap.gap-4

    clamped-noise(title="Low pass" instrument="FM"  :min="50" :max="10000" @random="filter.frequency.rampTo($event)")
    clamped-noise(title="Pan" instrument="FM"  :min="-1" @random="panner.pan.rampTo($event)")
    clamped-noise(title="Volume" instrument="FM"  @random="gain.gain.rampTo($event)")

</template>

<style lang="postcss" scoped>
.active {
  @apply bg-dark-100 text-light-200 dark-bg-light-200 dark-text-dark-200;
}
</style>