<template lang="pug">
.fullscreen-container.rounded-4xl(ref="screen")
  control-start.absolute(v-if="!tuner.initiated" @click="init()") Start
  full-screen.absolute.bottom-6.right-6.z-30(:el="screen")
  svg.max-h-3xl.w-full(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 100 100",
  xmlns="http://www.w3.org/2000/svg",
  )
    circle.note(
      style="transition: all 300ms ease-in-out;transform-box: fill-box; transform-origin: center center;"
      :cx="50",
      :cy="50",
      :r="10",
      :style="{ transform: `scale(${0.5 + 20 * tuner.rms})` }"
      :fill="tuner.note.silent ? '#888' : tuner?.note.color",
    )
    text(
      style="user-select:none;transition:all 300ms ease"
      fill="white"
      font-family="Commissioner, sans-serif"
      font-size="3px"
      text-anchor="middle",
      dominant-baseline="middle"
      :x="50",
      :y="50",
      ) {{ tuner.note.name }} 
    g.around(
      style="cursor:pointer"
      v-for="(amount,i) in rotateArray(tuner.chroma, -3)", 
      :key="i",
    )
      circle.note(
        style="transition: all 300ms ease-in-out;transform-box: fill-box; transform-origin: center center;"
        :cx="getCircleCoord(i).x",
        :cy="getCircleCoord(i).y",
        :r="2",
        :style="{ transform: `scale(${0.5 + 5 * amount})` }"
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
import { useTuner } from '@use/tuner.js'
const { init, tuner, chain } = useTuner();

const screen = ref();

</script>

<style scoped>
.note {
  @apply mix-blend-screen;
}
</style>