<template lang="pug">
.flex.flex-col.-my-8
  .p-4.m-8.shadow-lg.cursor-pointer.transition-all.duration-300.rounded-xl.text-4xl.bg-gray-300.text-center.font-bold(@click="start()", v-if="!state.running") Start tuner
  svg-save(svg="tuner", :file="`${state.note?.name}${state.note?.octave}`")
  svg#tuner.rounded-xl.w-full.max-h-3xl.-z3(
  v-if="state.running"
  version="1.1",
  baseProfile="full",
  viewBox="0 0 400 300",
  xmlns="http://www.w3.org/2000/svg",
  )
    rect(
      style="transition:all 300ms ease; "
      width="100%"
      height="100%"
      :fill="background"
    )
    line(
      v-for="(bar,i) in bars.slice(0,100)",
      :key="i",
      stroke="white"
      stroke-linecap="round"
      stroke-width="2"
      :x1="i * 4",
      :y1="300",
      :x2="i * 4",
      :y2="300 - bar * 0.8"
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
      :style="{ transform: `translateX(${5 * state.note?.cents}px)` }"
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
      ) {{ state.note?.cents > 0 ? '+' : '' }}{{ state.note?.cents }} 
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
    ) {{ state.note?.name }}{{ state.note?.octave }}
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
    ) {{ state.note?.frequency.toFixed(2) }} Hz
    
</template>

<script setup>
import { defineProps, ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import { noteColor } from 'chromatone-theory'
import { useTuner } from './useTuner.js'


const { init, state, chain } = useTuner();

const bars = computed(() => {
  return state.frequencyData || []
})

const background = computed(() => {
  const note = getRawNote(state.note?.frequency)
  if (!note) return '#333'
  const octave = state.note?.octave
  const color = noteColor(note, octave)
  return color
})

function start() {
  init();
}


function getRawNote(frequency) {
  const note = 12 * (Math.log(frequency / state.middleA) / Math.log(2))
  return note % 12
}




</script>

<style scoped>
.meter {
  transition: transform 500ms ease;
}
</style>