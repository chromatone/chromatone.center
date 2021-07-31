<template lang="pug">
g
  //- circle(
  //-   cx="0"
  //-   cy="0"
  //-   r="8"
  //-   :fill="pitch === false ? 'none' : colord(pitchColor(pitch, 2)).toHex()"
  //-   )
  g(
    v-for="(note,n) in rotateArray(chroma.split(''),-tonic)" :key="note"
    :transform="`translate(${getCircleCoord(n, 12, 8, 0).x}, ${getCircleCoord(n, 12, 8, 0).y})`"
  )
    circle(
      x="0" 
      y="0" 
      :r="note == '1' ? n == pitch % 12 ? 3 : 2.2 : 1"
      :fill="colord(note == '1' ? pitchColor(n) : notes[n].pos == 0 ? 'hsl(0,0%,95%)' : 'hsl(0,0%,60%)').toHex()"
      :stroke="colord(notes[n]?.pos == 0 ? 'hsl(0,0%,90%)' : 'hsl(0,0%,40%)').toHex()"
      :stroke-width="0.3"
    )
    text(
      v-if="note == '1'"
      y="0.3"
      font-size="2px"
      font-weight="bold"
      fill="white"
      ) {{ notes[n]?.name }}
  line(
    v-for="(note,n) in rotateArray(chroma.split(''),-tonic)" :key="note"
    :x1="getCircleCoord(n, 12, 6, 0).x"
    :y1="getCircleCoord(n, 12, 6, 0).y"
    x2="0"
    y2="0"
    stroke-linecap="round"
    stroke-width="2"
    :stroke="note == '1' ? colord(pitchColor(n)).toHex() : 'none'"
  )
  circle(
    cx="0"
    cy="0"
    r="5"
    :fill="pitch === false ? 'none' : colord(pitchColor(pitch)).toHex()"
    )
  text(
    y="0.3"
    font-size="2.5px"
    font-weight="bold"
    fill="white"
    ) {{ pitch === false ? '' : typeof pitch == 'string' ? pitch : notes[pitch % 12]?.name }}{{ type }}
  
</template>

<script setup>
import { notes, pitchColor, rotateArray, getCircleCoord } from 'chromatone-theory'
import { colord } from 'colord'
const props = defineProps({
  pitch: { type: Number, default: 0 },
  chroma: { type: String, default: '1001000100101' },
  type: { type: String, default: '' },
  tonic: { type: Number, default: 0 },
});
</script>

<style scoped>
</style>