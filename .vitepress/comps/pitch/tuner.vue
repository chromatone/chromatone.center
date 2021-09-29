<template lang="pug">
.flex.flex-col.-my-8.items-center
  start-button(@click="start()", v-if="!tuner.running") Start tuner
  svg#tuner.rounded-xl.w-full.max-h-3xl.-z3(
  v-if="tuner.running"
  version="1.1",
  baseProfile="full",
  viewBox="0 0 400 300",
  style="touch-action:none"
  xmlns="http://www.w3.org/2000/svg",
  )
    rect(
      style="transition:all 300ms ease; "
      width="100%"
      height="100%"
      :fill="background"
    )
    line(
      style="transition:all 200ms ease; "
      v-for="(bar,i) in tuner.spec.slice(0, 100)",
      :key="i",
      stroke="white"
      stroke-linecap="round"
      stroke-width="2"
      :x1="i * 4",
      :y1="300",
      :x2="i * 4",
      :y2="300 - bar"
    )
    g(
      v-for="(n) in 11",
      :key="n",
      :style="{ transform: `translateX(${40 * (n - 6)}px)` }"
    )
      line(
        stroke="gray"
        opacity="0.7"
        stroke-linecap="round"
        stroke-width="1"
        :x1="200"
        :x2="200"
        :y1="20"
        :y2="80"
      )
      text(
        style="user-select:none;transition:all 300ms ease; "
        fill="gray"
        font-family="Commissioner, sans-serif"
        font-size="6px"
        text-anchor="middle",
        dominant-baseline="middle"
        x="200"
        y="10"
      ) {{ (n - 6) * 10 }} 
    g.meter(
      :style="{ transform: `translateX(${5 * tuner.note?.cents}px)` }"
    )
      line(
        stroke="black"
        stroke-linecap="round"
        stroke-width="2"
        :x1="200"
        :x2="200"
        :y1="20"
        :y2="80"
      )
      text(
        style="user-select:none;transition:all 300ms ease; "
        fill="black"
        font-family="Commissioner, sans-serif"
        font-size="12px"
        text-anchor="middle",
        dominant-baseline="middle"
        x="200"
        y="94"
      ) {{ tuner.note?.cents > 0 ? '+' : '' }}{{ tuner.note?.cents }} 
    text(
      style="user-select:none;transition:all 300ms ease; "
      fill="black"
      font-family="Commissioner, sans-serif"
      font-size="3rem"
      font-weight="bold" 
      text-anchor="middle",
      dominant-baseline="middle"
      x="200"
      y="140"
    ) {{ tuner.note?.name }}{{ tuner.note?.octave }}
    text(
      style="user-select:none;transition:all 300ms ease; "
      fill="black"
      font-family="Commissioner, sans-serif"
      font-size="1rem"
      font-weight="bold"
      text-anchor="middle",
      dominant-baseline="middle"
      x="200"
      y="180"
    ) {{ tuner.note?.frequency.toFixed(2) }} Hz
</template>

<script setup>
import { computed } from 'vue'
import { pitchColor } from 'chromatone-theory'
import { useTuner } from '@use/tuner.js'


const { init, tuner, chain } = useTuner();

const bars = computed(() => {
  return tuner.frequencyData || []
})

const background = computed(() => {
  const note = getRawNote(tuner.note?.frequency)
  if (!note) return '#333'
  const octave = tuner.note?.octave
  const color = pitchColor(note, octave)
  return color
})

function start() {
  init();
}

function getRawNote(frequency) {
  return 12 * (Math.log(frequency / tuner.middleA) / Math.log(2)) % 12
}
</script>

<style scoped>
.meter {
  transition: transform 500ms ease;
}
</style>