<script setup>
import { rotateArray, getCircleCoord } from '#/use/calculations'
import { noteColor } from '#/use/colors'
import { notes } from '#/use/theory'
import { useTuner } from '#/use/tuner'
import { useClamp } from '@vueuse/math'
import { useDrag } from '@vueuse/gesture'
import { ref } from 'vue'

const stage = ref()


const { init, tuner } = useTuner();

const blur = useClamp(0, 0, 1)
const radius = useClamp(2, 0.5, 3)

useDrag(e => {
  const { delta: [x, y] } = e
  blur.value += x / 100
  radius.value -= y / 100
}, {
  domTarget: stage
})

function getAmmount(ammount) {
  return ammount > tuner.chromaAvg ? tuner.note.silent ? 0 : ammount : 0
}

</script>

<template lang="pug">
#screen.fullscreen-container
  control-start.absolute(
    v-if="!tuner.initiated" 
    @click="init()") Start
  svg.min-h-80svh.max-h-100svh.w-full.w-full#screen.cursor-pointer.touch-none(
    ref="stage"
    version="1.1",
    baseProfile="full",
    viewBox="0 0 100 100",
    xmlns="http://www.w3.org/2000/svg",
    )
    defs 
      filter#blur(
        x="-1" 
        y="-1" 
        width="3" 
        height="3")
        feGaussianBlur(i
        n="SourceGraphic" 
        :stdDeviation="blur / 2")
      filter#blur-more(
        x="-1" 
        y="-1" 
        width="3" 
        height="3")
        feGaussianBlur(
          in="SourceGraphic" 
          :stdDeviation="blur * 4")
    g    
      circle.note(
        style="transition: all 500ms ease-in-out;transform-box: fill-box; transform-origin: center center;"
        :cx="50",
        :cy="50",
        :r="10",
        :style="{ transform: `scale(${0.5 + 20 * tuner.rms})` }"
        :fill="tuner.note.silent ? '#555' : tuner?.note.color",
        filter="url(#blur-more)"
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
        :opacity="tuner.note.silent ? 0 : 1"
        ) {{ tuner.note.name }} 
      g.around(
        v-for="(ammount, i) in tuner.aChroma", 
        :key="i",
        :transform="`translate(${getCircleCoord(i).x},${getCircleCoord(i).y})`"
        style="cursor:pointer"
      )
        circle.note(
          style="transition: all 400ms ease-in-out;transform-box: fill-box; transform-origin: center center;"
          :r="radius",
          :style="{ transform: `scale(${0.5 + 10 * getAmmount(ammount)})` }"
          :fill="noteColor(i, 3, getAmmount(ammount))",
          filter="url(#blur)"
        )
        text(
          style="user-select:none;transition:all 500ms ease"
          :fill="notes[i].length == 2 ? 'hsla(0,0%,0%,0.8)' : 'hsla(0,0%,100%,0.9)'"
          font-family="Commissioner, sans-serif"
          font-size="3px"
          text-anchor="middle",
          dominant-baseline="middle"
          :opacity="getAmmount(ammount)"
        ) {{ notes[i] }} 
</template>
