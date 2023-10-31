<script setup>
import { reactive, ref } from 'vue'
import { UserMedia, Waveform, FFT } from 'tone'
import { useRafFn } from '@vueuse/core'
import { useTuner } from '#/use/tuner'
import { freqPitch } from '#/use/calculations'
import { noteColor } from '#/use/colors'

const { init, tuner } = useTuner()

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
    useRafFn(() => {
      audio.fft = fft.getValue()
      audio.wave = wave.getValue()
      audio.points = Array.from(audio.wave).map((val, i) => `${i},${120 + 280 * val}`).join(' ')
    })
  }).catch(() => {
    console.log('mic denied')
  })
}




</script>
  
<template lang="pug">
#screen.fullscreen-container
  control-start.absolute(
    v-if="!tuner.initiated"  
    @click="initiate()") Start
  svg#pitch-spectrum.rounded-xl.w-full.h-full.min-h-2xl.-z3(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 512 300",
    xmlns="http://www.w3.org/2000/svg",
    )
    g.lines(v-if="audio.fft.length > 0")
      line(
        v-for="(bar, i) in audio.bands"
        :key="i",
        style="transition:all 500ms ease; ",
        :stroke="noteColor(freqPitch(bar), 3, 1 - i / 256)"
        stroke-linecap="round"
        stroke-width="0.5"
        :x1="512 * bar / 1500",
        :y1="300",
        :x2="512 * bar / 1500",
        :y2="-(audio?.fft?.[i] * 1.5) || 1"
      )
    polyline(
      v-if="audio.points"
      :points="audio.points"
      stroke-width="4"
      fill="none"
      :stroke="tuner?.note.color"
    )
</template>
  
<style lang="postcss" scoped></style>