<script setup>
const props = defineProps({
  chroma: { type: String, default: '100010010000' },
  pitch: { type: Number, default: 0 }
});

import { globalScale } from '@use/theory.js'
import { pitchColor, notes, rotateArray } from 'chromatone-theory'

const keys = reactive({
  tonic: computed(() => props.pitch || globalScale.tonic),
  white: [3, 5, 7, 8, 10, 0, 2],
  black: [4, 6, null, 9, 11, 1],
  chroma: computed(() => {
    return rotateArray(props.chroma.split(''), props.pitch)
  })
});

function isInChroma(note) {
  console.log(note, keys.chroma, keys.chroma[note])

  return keys.chroma[note] == '1'
}

</script>

<template lang="pug">
svg.w-full.rounded-2xl.overflow-hidden(
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0 700 300`",
  xmlns="http://www.w3.org/2000/svg",
  font-family="Commissioner, sans-serif"
  font-weight="bold"
  font-size="50"
  text-anchor="middle",
  dominant-baseline="middle"
  )
  rect(
    fill="#eee2"
    width="700"
    height="300"
  )
  g.white
    g.key(
      v-for="(key,k) in keys.white" :key="key"
      :transform="`translate(${k * 100} 0)`"
    )
      rect(
        width="100"
        height="300"
        :fill="isInChroma(key) ? pitchColor(key) : '#eee'"

      )
      text(
        y="250"
        x="50"

      ) {{ notes[key].name }}
</template>
