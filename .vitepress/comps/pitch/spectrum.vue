<template lang="pug">
.flex.justify-center(v-if="!state.initiated" )
  start-button(@click="initiate()") Start
.flex.flex-col(v-else)
  svg#tuner.rounded-xl.w-full.max-h-3xl.-z3(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 512 300",
    xmlns="http://www.w3.org/2000/svg",
    )
    line(
      style="transition:all 500ms ease; "
      v-for="(bar,i) in audio.bands",
      :key="i",
      :stroke="pitchColor(freqPitch(bar), 3, 1 - i / 256)"
      stroke-linecap="round"
      stroke-width="0.5"
      :x1="512 * bar / 1500",
      :y1="300",
      :x2="512 * bar / 1500",
      :y2="- audio.fft[i] * 1.5"
    )
    polyline(
      :points="audio.points"
      stroke-width="4"
      fill="none"
      :stroke="state?.note?.color"
    )
  svg-save(svg="tuner")
</template>
  
<script setup>
import { reactive, computed } from 'vue'
import { UserMedia, Waveform, FFT } from 'tone'
import { useRafFn } from '@vueuse/core'
import { useTuner } from '@use/tuner.js'
import { freqPitch, pitchColor } from 'chromatone-theory'

const { init, state } = useTuner()

const wave = new Waveform(512)
const fft = new FFT({ size: 4096, smoothing: 0 })
const mic = new UserMedia().connect(fft).connect(wave)



const audio = reactive({
  initiated: false,
  fft: [],
  wave: [],
  bands: [],
  points: '',
})

for (let i = 0; i < 300; i++) {
  audio.bands[i] = fft.getFrequencyOfIndex(i)
}

function initiate() {
  mic.open().then(() => {
    init()
    audio.initiated = true
    console.log('mic open')
    const { resume, pause } = useRafFn(() => {
      audio.fft = fft.getValue()
      audio.wave = wave.getValue()
      audio.points = Array.from(audio.wave).map((val, i) => `${i},${150 + 280 * val}`).join(' ')
    })
  }).catch(() => {
    console.log('mic denied')
  })
}




</script>
  
<style scoped>
</style>