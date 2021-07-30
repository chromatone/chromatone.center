<template lang="pug">
g
  circle(
    cx="0"
    cy="0"
    r="8"
    :fill="pitch === false ? 'none' : colord(pitchColor(pitch, 2)).toHex()"
    )
  g(
    v-for="(note,n) in rotateArray(chroma.split(''),-tonic)" :key="note"
    :transform="`translate(${getCircleCoord(n, 12, 8, 0).x}, ${getCircleCoord(n, 12, 8, 0).y})`"
  )
    circle(
      x="0" 
      y="0" 
      :r="1.96"
      :fill="colord(note == '1' ? pitchColor(n) : notes[n].pos == 0 ? 'hsl(0,0%,80%)' : 'hsl(0,0%,50%)').toHex()"
      :stroke="colord(notes[n]?.pos == 0 ? 'hsl(0,0%,90%)' : 'hsl(0,0%,30%)').toHex()"
      :stroke-width="0.3"
    )
  line(
    v-for="(note,n) in rotateArray(chroma.split(''),-tonic)" :key="note"
    :x1="getCircleCoord(n, 12, 8, 0).x"
    :y1="getCircleCoord(n, 12, 8, 0).y"
    x2="0"
    y2="0"
    stroke-linecap="round"
    stroke-width="3.6"
    :stroke="note == '1' ? colord(pitchColor(n)).toHex() : 'none'"
  )
  circle(
    cx="0"
    cy="0"
    r="2.5"
    :fill="pitch === false ? 'none' : colord(pitchColor(pitch)).toHex()"
    )
  text(
    y="-1"
    font-size="6px"
    font-weight="bold"
    fill="white"
    ) {{ props.pitch === false ? '' : notes[pitch].name }}
  text(
    y="3"
    font-size="3px"
    font-weight="bold"
    fill="white"
    ) {{ type }}
  
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