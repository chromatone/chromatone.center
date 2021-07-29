<template lang="pug">
g
  circle(
    cx="0"
    cy="0"
    r="8"
    :fill="pitchColor(pitch)"
    )
  text(
    y="-1"
    font-size="6px"
    font-weight="bold"
    fill="white"
    ) {{ note.name }}
  text(
    y="3"
    font-size="3px"
    font-weight="bold"
    fill="white"
    ) {{ type }}
  g(
    v-for="(note,n) in rotateArray(chroma.split(''),-tonic)" :key="note"
    :transform="`translate(${getCircleCoord(n, 12, 8, 0).x}, ${getCircleCoord(n, 12, 8, 0).y})`"
  )
    circle(
      x="0" y="0" r="1.96"
      :fill="note == '1' ? pitchColor(n) : notes[n].pos == 0 ? 'hsl(0,0%,80%)' : 'hsl(0,0%,50%)'"
      :stroke="notes[n].pos == 0 ? 'hsl(0,0%,90%)' : 'hsl(0,0%,30%)'"
      stroke-width="0.25"
    )

</template>

<script setup>
import { notes, pitchColor, rotateArray, getCircleCoord } from 'chromatone-theory'
const props = defineProps({
  pitch: { type: Number, default: 0 },
  chroma: { type: String, default: '1001000100101' },
  type: { type: String, default: '' },
  tonic: { type: Number, default: 0 },
});

const note = computed(() => notes[props.pitch]);
</script>

<style scoped>
</style>