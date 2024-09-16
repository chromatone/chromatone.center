<script setup>
import { useTimestamp } from '@vueuse/core';
import { createNoise2D } from 'simplex-noise';
import { computed } from 'vue';

const time = useTimestamp({ offset: -Date.now() })
const noise = createNoise2D()
const random1 = computed(() => noise(0, time.value / 100000))
const random2 = computed(() => noise(10000, time.value / 50000))

</script>

<template lang='pug'>
svg.w-full.p-2(
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0 1000 1000`",
  xmlns="http://www.w3.org/2000/svg",
  style="user-select:none;touch-action:none"
  stroke-width="1"
  stroke="currentColor"
  fill="none"
  )
  //- g.grid(
    v-for="g in 2" :key="g"
    :transform="`translate(500 500) rotate(${noise((g - 1), time / 100000) * 180}) translate(-500 -500) scale(${random1 + 2})`")
    line(

      v-for="l in 50" :key="l"
      :y1="-200"
      :y2="1200" :transform="`translate(${l * 5 * (noise(g * l / 50, time / 100000) + 2)})`")
  g.circle(v-for="cir in 3" :key='cir')
    circle(
      :transform="`translate(${500 + 400 * noise(c / (50 * cir), cir * time / 48000)} ${500 + 400 * noise(c / (30 + cir), cir * time / 48000)})`"
      :r="c * 10 * (noise(2, 10000) * .8 + 2)"
      v-for="c in 30" :key="c")
  rect(width="1000" height="1000" stroke-width="2")
</template>