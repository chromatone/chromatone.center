<script setup>
import { pitchColor, rotateArray, getCircleCoord } from '@use/calculations'
import { notes } from '@use/theory'
import { chromaColorMix } from "@use/colors.js";
import { colord } from 'colord'
const props = defineProps({
  pitch: { type: Number, default: 0 },
  chroma: { type: String, default: '1001000100101' },
  type: { type: String, default: '' },
  tonic: { type: Number, default: 0 },
});
</script>

<template lang="pug">
g
  //- circle(
    cx="0"
    cy="0"
    r="8"
    :fill="pitch === false ? 'none' : colord(pitchColor(pitch)).toHex()"
    )
  g(v-for="(note, n) in rotateArray(chroma.split(''), -tonic)" :key="note")
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
  g(
    v-for="(note, n) in rotateArray(chroma.split(''), -tonic)" :key="note"
    :transform="`translate(${getCircleCoord(n, 12, 8, 0).x}, ${getCircleCoord(n, 12, 8, 0).y})`"
  )
    circle(
      x="0" 
      y="0" 
      :r="note == '1' ? 2 : 1"
      :fill="colord(note == '1' ? pitchColor(n) : notes?.[n].length != 2 ? 'hsl(0,0%,85%)' : 'hsl(0,0%,60%)').toHex()"
    )
    text(
      v-if="note == '1'"
      y="0.3"
      font-size="2px"
      font-weight="bold"
      fill="white"
      ) {{ notes?.[n] }}

  circle(
    cx="0"
    cy="0"
    r="5"
    :fill="pitch === false ? 'none' : chromaColorMix(chroma, pitch)"
    )
  text(
    y="0.3"
    font-size="3px"
    font-weight="bold"
    fill="white"
    ) {{ pitch === false ? '' : typeof pitch == 'string' ? pitch : notes?.[pitch % 12] }}{{ type }}
  
</template>

<style lang="postcss" scoped>
</style>