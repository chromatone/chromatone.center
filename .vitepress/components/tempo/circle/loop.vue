<template lang="pug">
g
  tempo-circle-sector(
    v-for="step in steps"
    :key="step"
    :step="step"
    :total="steps.length"
    :active="step == current"
  )
  line(
    style="mix-blend-mode:difference;"
    :x1="500"
    :y1="500"
    stroke-width="4"
    stroke="currentColor"
    stroke-linecap="cound"
    :x2="lineProgress.x"
    :y2="lineProgress.y"
  )
  circle(
    :cx="500"
    :cy="500"
    fill="currentColor"
    :r="5"
  )
  </template>
  
  <script setup>
import { tempo } from '@use/tempo.js'
import { computed } from "vue";
import { getCircleCoord } from 'chromatone-theory'
import { useSequence } from '../sequence.js'

const { progress, current, steps, measure } = useSequence()

const lineProgress = computed(() => {
  if (progress.value > 0) {
    return getCircleCoord(progress.value * 360, 360, 400, 1000)
  } else {
    return { x: 500, y: 100 }
  }
});

</script>
  
  <style scoped>
.info {
  @apply p-2 rounded-full m-1 border-1 border-current text-2xl;
}

.active,
.measure.active {
  @apply bg-current transition-all duration-400;
}

.measure {
  background-color: hsla(0, 0%, 50%, 0.5);
}
</style>