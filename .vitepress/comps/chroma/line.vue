<script setup>
import { pitchColor } from 'chromatone-theory'
import { globalScale } from '@use/chroma'
const props = defineProps({
  chroma: {
    type: String,
    default: '101010101010'
  }
});

const dist = [0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0];
</script>

<template lang="pug">
svg.select-none.w-20rem.m-2(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 95 6",
  xmlns="http://www.w3.org/2000/svg",
  font-family="Commissioner, sans-serif"
  text-anchor="middle",
  dominant-baseline="middle"
)
  g.cursor-pointer(v-for="(note,n) in chroma.split('')" :key="n")
    circle.transition-all.duration-300.ease-out(
      @click="globalScale.tonic = (globalScale.tonic + n) % 12"
      :cx="n * 8 + 4 + 2 * dist[n]"
      cy="3"
      r="2"
      :fill="note == '1' ? pitchColor(n + globalScale.tonic, 3) : 'transparent'"
      :stroke="note == '0' ? 'currentColor' : 'transparent'"
      stroke-width="0.25"
)
</template>



<style scoped>
</style>