<template lang="pug">
svg.select-none.max-w-12em.my-4.mx-auto(
  version="1.1",
  baseProfile="full",
  viewBox="-10 -10 20 20",
  xmlns="http://www.w3.org/2000/svg",
  style="touch-action:none"
  font-family="Commissioner, sans-serif"
  text-anchor="middle",
  dominant-baseline="middle"
)
  //- circle(
    cx="0"
    cy="0"
    r="8"
    :fill="pitch === false ? 'none' : colord(pitchColor(pitch)).toHex()"
    )
  g(v-for="(note,n) in rotateArray(chroma.split(''), -globalScale.tonic)" :key="n")
    line(
      :x1="getCircleCoord(n, 12, 6.5, 0).x"
      :y1="getCircleCoord(n, 12, 6.5, 0).y"
      x2="0"
      y2="0"
      v-if="note == '1'"
      stroke-linecap="square"
      stroke-width="3.92"
      :stroke="note == '1' ? colord(pitchColor(n)).toHex() : 'none'"
      )
  g.cursor-pointer(
    v-for="(note,n) in rotateArray(chroma.split(''), -globalScale.tonic)" :key="n"
    :transform="`translate(${getCircleCoord(n, 12, 8, 0).x}, ${getCircleCoord(n, 12, 8, 0).y})`"
    @click="globalScale.tonic = n"
  )
    circle(
      x="0" 
      y="0" 
      :r="note == '1' ? 2 : 1"
      :fill="colord(note == '1' ? pitchColor(n) : notes[n].pos == 0 ? 'hsl(0,0%,85%)' : 'hsl(0,0%,60%)').toHex()"
    )
    text(
      v-if="note == '1'"
      y="0.3"
      font-size="2px"
      font-weight="bold"
      fill="white"
      ) {{ notes[n]?.name }}

  circle(
    cx="0"
    cy="0"
    r="5"
    :fill="pitch === false ? 'none' : colord(pitchColor(globalScale.tonic)).toHex()"
    )
  text(
    y="0.3"
    font-size="3px"
    font-weight="bold"
    fill="white"
    ) {{ pitch === false ? '' : typeof pitch == 'string' ? pitch : notes[globalScale.tonic]?.name }}{{ type }}
</template>

<script setup>
import { notes, pitchColor, rotateArray, getCircleCoord } from 'chromatone-theory'
import { colord } from 'colord'
import { globalScale } from '@use/theory.js'


const props = defineProps({
  pitch: { type: Number, default: 0 },
  chroma: { type: String, default: '1001000100101' },
  type: { type: String, default: '' },
  tonic: { type: Number, default: 0 },
});
</script>

<style scoped>
</style>