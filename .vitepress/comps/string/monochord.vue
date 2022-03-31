<script setup>
import { freqColor, freqPitch } from '@use/calculations'
import { useTransition, TransitionPresets } from '@vueuse/core'
import { useSynth } from '@use/synth.js'
import { Frequency } from 'tone'
import Fraction from 'fraction.js'

const state = reactive({
  ratio: useClamp(0.8, 0.05, 0.95),
  fraction: computed(() => new Fraction(1 - state.ratio).simplify(0.001).toFraction(true)),
  invFraction: computed(() => new Fraction(state.ratio).simplify(0.001).toFraction(true)),
});
const fundamental = reactive({
  freq: useClamp(220, 50, 2000),
  pitch: computed(() => freqPitch(fundamental.freq).toFixed()),
  note: computed(() => Frequency(fundamental.freq).toNote()),
  cents: computed(() => calcCents(Frequency(fundamental.note).toFrequency(), fundamental.freq)),
})

const part1 = reactive({
  freq: computed(() => fundamental.freq / (1 - state.ratio)),
  pitch: computed(() => (freqPitch(part1.freq) + 120) % 12),
  note: computed(() => Frequency(part1.freq).toNote()),
  cents: computed(() => calcCents(Frequency(part1.note).toFrequency(), part1.freq)),
})

const part2 = reactive({
  freq: computed(() => fundamental.freq / state.ratio),
  pitch: computed(() => (freqPitch(part2.freq) + 120) % 12),
  note: computed(() => Frequency(part2.freq).toNote()),
  cents: computed(() => calcCents(Frequency(part2.note).toFrequency(), part2.freq)),
})

const fractions = {
  '1/2': 1 / 2,
  '2/3': 2 / 3,
  '3/4': 3 / 4,
  '3/5': 3 / 5,
  '4/5': 4 / 5,
  '5/6': 5 / 6,
  '4/7': 4 / 7,
  '5/7': 5 / 7,
  '6/7': 6 / 7,
  '5/8': 5 / 8,
  '7/8': 7 / 8,
  '5/9': 5 / 9,
  '7/9': 7 / 9,
  '8/9': 8 / 9,
  '9/10': 9 / 10,
  '10/11': 10 / 11,
  '11/12': 11 / 12,
  '8/15': 8 / 15,
  '15/16': 15 / 16,
  '32/45': 32 / 45
}

const ratio = useTransition(computed(() => state.ratio), {
  duration: 200,
  transition: TransitionPresets.easeOutCubic,
})

const { synth, synthOnce } = useSynth();

function dragFun(drag) {
  fundamental.freq += drag.delta[0] / 4
}

function changeRatio(drag) {
  state.ratio -= drag.delta[0] / 1200
}

function calcCents(base, freq) {
  return -(1200 / Math.log10(2)) * (Math.log10(base / freq)) % 1200
}


</script>

<template lang="pug">
.flex.flex-col.fullscreen-container#screen.rounded-4xl
  full-screen.absolute.top-2.right-2
  svg.py-8.select-none(
    version="1.1",
    baseProfile="full",
    :viewBox="`-10 -5 120 35`",
    xmlns="http://www.w3.org/2000/svg",
    font-family="Commissioner, sans-serif"
    font-size="3px"
    text-anchor="middle",
    dominant-baseline="middle"
    stroke-linecap="round"
    fill="white"
    style="touch-action:none"
    )
    g#ruler(stroke-width="0.2" stroke="currentColor")
      line(y1=30 y2=30 x2=100  )
      line(y1=0 y2=30)
      line(x1=100 x2=100 y1=0 y2=30)
      line(
        :x1="100 * (1 - ratio)"
        :x2="100 * (1 - ratio)"
        y1=0 y2=30
        )
      g#freqs(stroke="none",fill="currentColor")
        g#left(text-anchor="end")
          text( :x="100 * (1 - ratio) - 2" y=28) {{ part1.freq.toFixed(1) }} Hz
          text( :x="100 * (1 - ratio) - 2" y=24) {{ part1.note }} ({{ part1.cents.toFixed() }} cents) 
        g#right(text-anchor="start")
          text( :x="100 * (1 - ratio) + 2" y=28) {{ part2.freq.toFixed(1) }} Hz
          text( :x="100 * (1 - ratio) + 2" y=24) {{ part2.note }} ({{ part2.cents.toFixed() }} cents) 
      g#ratio.cursor-pointer(font-size="4px" fill="currentColor")
        g(@mousedown="synthOnce(fundamental.freq); synthOnce(part1.freq)")
          text(
            :x="100 * (1 - ratio) - 2"
            y=8
            text-anchor="end"
          ) {{ state.fraction }} 
        g(@mousedown="synthOnce(fundamental.freq); synthOnce(part2.freq)")
          text(
            :x="100 * (1 - ratio) + 2"
            y=8
            text-anchor="start"          
          ) {{ state.invFraction }} 
    g#fundamental.cursor-pointer(@mouseover="synthOnce(fundamental.freq)" @mousedown="synthOnce(fundamental.freq)" v-drag="dragFun")
      line(x2=100, stroke-width="4", :stroke="freqColor(fundamental.freq)" )
      circle(r=1)
      circle(cx=100,r=1)
      text(x=50 font-weight="bold") {{ fundamental.note }}  {{ fundamental.freq.toFixed() }} Hz ({{ fundamental.cents.toFixed() }} cents)
    g#divided.cursor-pointer(transform="translate(0,15)" v-drag="changeRatio" font-weight="bold")
      g#part1(@mouseover="synthOnce(part1.freq)" @mousedown="synthOnce(part1.freq)")
        line( 
          :stroke="freqColor(part1.freq)" 
          stroke-width="4",
          :x2="100 * (1 - ratio)"
        )
        text(y=0.3, :x="100 * (1 - ratio) / 2") {{ part1.note }}
      g#part2(@mouseover="synthOnce(part2.freq)" @mousedown="synthOnce(part2.freq)")
        line( 
          :stroke="freqColor(part2.freq)" 
          stroke-width="4",
          :x1="100 * (1 - ratio)"
          x2=100
        )
        text(y=0.3,:x="100 - 100 * (ratio) / 2") {{ part2.note }}
        circle(:cx="100 * (1 - ratio)" r=1)
      circle(r=1)
      circle(r=1 cx=100)

  .flex.flex-wrap.justify-center.m-4
    button.p-2.border-1.shadow.m-2(@click="state.ratio = frac" v-for="(frac, fName) in fractions" :key="fName") {{ fName }}
</template>