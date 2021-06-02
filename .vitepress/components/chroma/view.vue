<template lang="pug">
.flex.justify-center(v-if="!state.initiated" )
  start-button(@click="init()") Start
.flex.flex-col(v-else)
  svg.max-h-3xl.w-full(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 100 100",
  xmlns="http://www.w3.org/2000/svg",
  )
    circle.note(
      style="transition: all 200ms ease-in-out;transform-box: fill-box; transform-origin: center center;"
      :cx="50",
      :cy="50",
      :r="50 * state.rms + 1",
      :fill="state?.note.color",
    )
    g.around(
      style="cursor:pointer"
      v-for="(amount,i) in rotateArray(state.chroma,-3)", 
      :key="i",
    )
      circle.note(
        style="transition: all 200ms ease-in-out;transform-box: fill-box; transform-origin: center center;"
        :cx="getCircleCoord(i).x",
        :cy="getCircleCoord(i).y",
        :r="1 + 10 * amount",
        :fill="pitchColor(i, 3, amount)",
      )
      text(
        style="user-select:none;transition:all 300ms ease"
        :fill="!scales.minor.steps[i] ? 'hsla(0,0%,0%,0.8)' : 'hsla(0,0%,100%,0.9)'"
        font-family="Commissioner, sans-serif"
        font-size="3px"
        text-anchor="middle",
        dominant-baseline="middle"
        :x="getCircleCoord(i).x",
        :y="getCircleCoord(i).y + 0.25",
      ) {{ notes[i].name }} 
</template>

<script setup>
import { pitchColor, rotateArray, scales, notes, getCircleCoord } from 'chromatone-theory'
import { defineProps } from 'vue'
import { useTuner } from '@use/tuner.js'
const { init, state, chain } = useTuner();
</script>

<style scoped>
</style>