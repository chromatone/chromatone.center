<template lang="pug">
svg#dissonance.max-h-3xl.w-full.my-20(
  version="1.1",
  baseProfile="full",
  :viewBox="`${-box.padX} ${-box.padY} ${box.width + 2 * box.padX} ${box.height + box.padY}`",
  xmlns="http://www.w3.org/2000/svg",
  )
  rect.box(
    v-bind="box"
  )
  polyline(
    v-bind="fundamental"
  )
</template>

<script setup>
import { reactive, computed } from 'vue'
import { pitchColor } from 'chromatone-theory'
const box = reactive({
  width: 100,
  height: 100,
  padX: 50,
  padY: 50,
  x: 0,
  y: 0,
  stroke: 'currentColor',
  fill: 'none',
  'stroke-width': 0.2
});

const fundamental = reactive({
  pitch: 0,
  points: `0,0 100,0`,
  stroke: computed(() => pitchColor(fundamental.pitch))
});



</script>

<style scoped>
</style>