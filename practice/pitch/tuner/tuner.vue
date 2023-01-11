<script setup>
import { noteColor } from "#/use/colors"
import { useTuner } from '#/use/tuner.js'
import { computed } from 'vue'

const { init, tuner, } = useTuner();

const background = computed(() => {
  const note = getRawNote(tuner.note?.frequency)
  if (!note) return '#333'
  const octave = tuner.note?.octave
  const color = noteColor(note, octave)
  return color
})

function start() {
  init();
}

function getRawNote(frequency) {
  return 12 * (Math.log(frequency / tuner.middleA) / Math.log(2)) % 12
}
</script>

<template lang="pug">
.fullscreen-container#screen.rounded-3xl.overflow-hidden.mb-4
  control-start.absolute.z-20(
    v-if="!tuner.running", 
    @click="start()") Start tuner
  svg#tuner.w-full.min-h-full(
  :opacity="tuner.running ? 1 : 0.3"
  version="1.1",
  baseProfile="full",
  viewBox="0 0 400 300",
  xmlns="http://www.w3.org/2000/svg",
  )
    defs
      linearGradient#grad(
        x1="0" 
        x2="0" 
        y1="0" 
        y2="1")
        stop(
          :stop-color="background" 
          stop-opacity="1" 
          offset="0%")
        stop(
          :stop-color="background" 
          stop-opacity="1" 
          offset="30%")
        stop(
          :stop-color="background" 
          stop-opacity="0.8" 
          offset="60%")
        stop(
          :stop-color="background" 
          stop-opacity="0.2" 
          offset="100%")
    rect(
      width="400"
      height="300"
      rx="5"
      fill="url(#grad)"
    )
    line(
      v-for="(bar, i) in tuner.spec.slice(0, 100)",
      :key="i",
      style="transition:all 200ms ease; "
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
      style="user-select:none;transition:all 600ms ease; "
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

<style lang="postcss" scoped>
.meter {
  transition: transform 500ms ease;
}

stop {
  transition: all 600ms ease;
}
</style>