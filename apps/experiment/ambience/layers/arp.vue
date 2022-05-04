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
  Loop,
  PluckSynth,
  Panner,
  Filter,
  FeedbackDelay,
  Pattern
} from "tone";

import { notes } from '@use/theory'

const options = useStorage("ambient-arp-options", {
  attackNoise: 2,
  volume: 20,
  resonance: 20
});

const active = ref(false)
const note = ref(0)
const octave = ref(4)

const gain = new Gain(options.value.volume).toDestination()
const filter = new Filter({ type: 'lowpass', frequency: 1500, Q: 0 }).connect(gain)
const reverb = new Reverb(4).connect(filter)
const delay = new FeedbackDelay({ delayTime: '8t', feedback: 0.6 }).connect(reverb)
const panner = new Panner(0).connect(delay)
const synth = new PluckSynth({
  attackNoise: 2,
  resonance: 0.85,
}).connect(panner)

const loop = new Pattern({
  callback(time, value) {
    synth.triggerAttackRelease(value, '8n', time)
  },
  values: [notes[note.value] + octave.value, notes[(note.value + 7) % 12] + octave.value, notes[note.value] + (octave.value + 1)],
  pattern: 'random',
  interval: '8n',
  humanize: true,
})

watch(note, n => {
  loop.values = [notes[n] + octave.value, notes[(n + 7) % 12] + octave.value, notes[n] + (octave.value + 1)]
})

watch(active, a => {
  if (a) {
    loop.start(0)
  } else {
    loop.stop()
  }
})

</script>

<template lang='pug'>
.flex.flex-col.gap-4
  .flex.items-center
    .font-bold Pluck
    button.p-2(@click="active = !active")
      la-play(v-if="!active")
      la-pause(v-else)
    .flex.flex-wrap.gap-2
      button.p-1(v-for="(n, i) in notes" :key="n" @click="note = i" :class="{ active: i == note }") {{ n }}
  .flex.flex-wrap.gap-4

    clamped-noise(title="Low pass" instrument="Arp" :min="50" :max="10000" @random="filter.frequency.rampTo($event)")
    clamped-noise(title="Probability" instrument="Arp" @random="loop.probability = $event")
    clamped-noise(title="Pan" instrument="Arp" :min="-1" @random="panner.pan.rampTo($event)")
    clamped-noise(title="Volume" instrument="Arp" @random="gain.gain.rampTo($event)")

</template>

<style lang="postcss" scoped>
.active {
  @apply bg-dark-100 text-light-200 dark_bg-light-200 dark_text-dark-200;
}
</style>