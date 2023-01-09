<script setup>
import ClampedNoise from '../clampedNoise.vue';
import {
  NoiseSynth,
  gainToDb,
  dbToGain,
  FFT,
  Gain,
  AutoFilter,
  AutoPanner,
  BitCrusher,
  Reverb,
  Panner,
  Filter
} from "tone";

import { createChannel } from '#/use/audio'

const options = useStorage("ambient-options", {
  noise: {
    type: "brown",
  },
  envelope: {
    attack: 1,
    decay: 0.1,
    sustain: 0.9,
    release: 6,
  },
  volume: 1,
});

const active = ref(false)

const channel = createChannel('ambient-noise')

const gain = new Gain(options.value.volume).connect(channel)
const filter = new Filter({ type: 'lowpass', frequency: 1500, Q: 0 }).connect(gain)
const bitCrusher = new BitCrusher(4).connect(filter)
const panner = new Panner(0).connect(bitCrusher)
const synth = new NoiseSynth(options.value).connect(panner)

// watch(volRandom, v => gain.gain.rampTo(v))

watch(active, a => {
  if (a) {
    synth.triggerAttack()
  } else {
    synth.triggerRelease()
  }
})

</script>

<template lang='pug'>
.flex.flex-col.gap-4
  .flex.items-center
    .font-bold NOISE
    button.p-2(@click="active = !active")
      .i-la-play(v-if="!active")
      .i-la-pause(v-else)
  .flex.flex-wrap.gap-4
    clamped-noise(
      title="Bit crusher" instrument="Noise"  
      :min="2" :max="8" 
      @random="bitCrusher.bits.rampTo($event)"
      )
    clamped-noise(
      title="Low pass" instrument="Noise" 
      :min="50" :max="10000" 
      @random="filter.frequency.rampTo($event)"
      )
    clamped-noise(
      title="Pan" instrument="Noise" 
      :min="-1" :max="1"
      @random="panner.pan.rampTo($event)"
      )
    clamped-noise(
      title="Volume" instrument="Noise" 
      @random="gain.gain.rampTo($event)"
      )
</template>

<style lang="postcss" scoped>
.active {
  @apply bg-dark-100 text-light-200 dark-bg-light-200 dark-text-dark-200;
}
</style>