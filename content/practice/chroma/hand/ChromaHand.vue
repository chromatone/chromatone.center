<script setup>
import { notes, intervals } from '#/use/theory'
import { noteColor } from '#/use/colors'
import { rotateArray } from '#/use/calculations'
import { midi, guessChords } from '#/use/midi'
import { globalScale } from '#/use/chroma'
import { colord } from "colord";
import { computed, onMounted, ref, shallowRef } from 'vue'
import { useData } from 'vitepress'
const { isDark } = useData()

const props = defineProps({
  size: { type: Number, default: 1000 },
  height: { type: Number, default: 900 },
  width: { type: Number, default: 500 },
  pad: { type: Number, default: 50 },
  right: { type: Boolean, default: false }
})

const fingers = [
  [20, 220],
  [120, 500],
  [220, 580],
  [320, 505],
  [420, 340]
]

const pointList = [
  [120, 100],
  [120, 240],
  [120, 400],
  [220, 360],
  [320, 410],
  [420, 480],
  [420, 370],
  [420, 260],
  [320, 95],
  [220, 20],
  [220, 200],
  [320, 250],
]


const points = computed(() => {
  return rotateArray(notes, props.right ? -globalScale.tonic : 0).map((note, n) => {
    return {
      note: note,
      pitch: (n + (props.right ? globalScale.tonic : 0)) % 12,
      x: pointList[n][0],
      y: pointList[n][1],
      r: 40
    }
  })
})

const pressed = ref()


</script>

<template lang="pug">
svg.h-90.mr-auto.ml-4(
  version="1.1",
  baseProfile="full",
  :viewBox="`${-pad} ${-pad} ${width + 2 * pad} ${height + 2 * pad}`",
  xmlns="http://www.w3.org/2000/svg",
  text-anchor="middle" 
  dominant-baseline="middle" 
  )
  defs
    filter#shadow
      feDropShadow(
        dx="0"
        dy="0"
        stdDeviation="8"
        flood-opacity="0.5"
        :flood-color="isDark ? 'white' : 'black'"
      )

  g.hand.opacity-50(
    filter="url(#shadow)"
    )
    line.finger(
      v-for="(finger, f) in fingers"
      :key="finger"
      :x1="finger[0]"
      :x2="finger[0]"
      :y1="700"
      :y2="600 - finger[1]"

      :stroke="isDark ? 'white' : 'gray'"
      stroke-width="90"
      stroke-linecap="round"
      )
    circle.palm(
      :fill="isDark ? 'white' : 'gray'"
      :cx="220"
      :cy="700"
      :r="244"
      )
  g.points
    g.point(
      @click="right ? null : globalScale.tonic = p"
      v-for="(point, p) in points"
      :opacity="midi.activeChromaMidi[point.pitch] ? 1 : 0.7"
      :transform="`translate(${point.x} ${point.y})`"
      )
      circle(
        style="transition: all 100ms ease-out"
        :alt="point.pitch"
        :r="point.pitch == globalScale.tonic ? 60 : point.r"
        :fill="noteColor(point.pitch, midi.activeChromaMidi[point.pitch] ? 4 : 3, midi.activeChromaMidi[point.pitch] ? 1 : .6)"
        )
      text.pointer-events-none(
        font-family="Commissioner"
        font-weight="bold"
        font-size="40"
        fill="white"
        :opacity="midi.activeChromaMidi[point.pitch] ? 1 : 0"
        :transform="`scale(${right ? -1 : 1} 1)`"
      ) {{ right ? intervals[p] : notes[p] }}


    g.chord.cursor-pointer(
      :transform="`translate(200 700)`"
      )
      text(
        v-if="!right"
        y="6"
        font-size="80"
        fill="currentColor"
      ) {{ guessChords[0] }}

</template>

<style scoped lang="postcss">
input[type="color"] {
  width: 3rem;
  height: 3rem;
  padding: .5rem;
  background-color: transparent;
  border: 0;
  border-radius: 100%;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}
</style>