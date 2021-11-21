<script setup>
const props = defineProps({
  chroma: { type: String, default: '100010010000' },
  pitch: { type: Number, default: 0 },
  scale: { type: String, default: '1010111010101' }
});

const emit = defineEmits(['update:pitch'])

import { globalScale } from '@use/chroma'
import { pitchColor, notes, rotateArray } from 'chromatone-theory'

const keys = reactive({
  tonic: computed(() => props.pitch || globalScale.tonic),
  white: [3, 5, 7, 8, 10, 0, 2],
  black: [4, 6, null, 9, 11, 1],
  chroma: computed(() => rotateArray(props.chroma.split(''), -props.pitch)),
  scale: computed(() => rotateArray(props.scale.split(''), -props.pitch))
});

function isInChroma(note) {
  return note != null && keys.chroma[note] == '1'
}

function isInScale(note) {
  return note != null && keys.scale[note] == '1'
}

</script>

<template lang="pug">
svg.w-full.cursor-pointer(
  version="1.1",
  baseProfile="full",
  :viewBox="`-10 -10 720 320`",
  xmlns="http://www.w3.org/2000/svg",
  font-family="Commissioner, sans-serif"
  font-weight="bold"
  font-size="50"
  text-anchor="middle",
  dominant-baseline="middle"
  )
  defs
    filter#shadowButton(x="-50%" height="200%" width="300%")
      feDropShadow(dx="0" dy="3" stdDeviation="4" flood-color="#2225")
  g.white
    g.key(
      v-for="(key,k) in keys.white" :key="key"
      :transform="`translate(${k * 100 + 5} 0)`"
      @click="$emit('update:pitch', key)"
    )
      rect.transition-all.duration-300.ease-out(
        width="90"
        height="300"
        rx="45"
        :fill="isInChroma(key) ? pitchColor(key) : isInScale(key) ? pitchColor(key, null, 0.3) : '#eee'"
        style="filter:url(#shadowButton);"
      )
      text(
        y="250"
        x="45"
        fill="white"
        v-if="isInChroma(key)"
      ) {{ notes[key].name }}
  g.black 
    g.key(
      v-for="(key,k) in keys.black" :key="key"
      :transform="`translate(${k * 100 + 55} 10)`"
      @click="$emit('update:pitch', key)"
    )
      rect.transition-all.duration-300.ease-out(
        v-if="key"
        width="90"
        height="200"
        rx="45"
        style="filter:url(#shadowButton);"
        :fill="isInChroma(key) ? pitchColor(key) : '#aaa'"
      )
      text.transition-all.duration-300.ease-out(
        y="150"
        x="40"
        fill="white"
        :opacity="isInChroma(key) ? 1 : 0"
      ) {{ notes[key]?.name }}
</template>
