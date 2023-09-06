<script setup>
import { useTimestamp } from '@vueuse/core'
import { computed, reactive, ref, watchEffect } from 'vue';

const { timestamp: time, resume, pause } = useTimestamp({ offset: -Date.now(), controls: true })

const circles = reactive([]);
const moving = ref(false)
watchEffect(() => {
  if (moving.value) {
    resume()
  } else {
    pause()
  }
})

for (let c = 1; c < 25; c++) {
  const circle = {
    cx: computed(() => Math.cos(time.value / 1000 - c) * 3.5 + 10),
    r: c * 4,
  }
  circles.push(circle)
}
</script>

<template lang="pug">
svg(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 100 70",
  xmlns="http://www.w3.org/2000/svg",
)
  g.cursor-pointer(
    :transform="`translate(${circles[0].cx},0)`"
    @click="moving = !moving"
  )
    circle(
      cx="0"
      cy="35"
      r="4.5"
      fill="currentColor"

    )
    polygon(
      v-if="!moving"
      fill="gray"
      points="-2,32 3,35 -2,38"
    )
  circle(
    v-for="(circle,c) in circles"
    :key="c"
    v-bind="circle"
    cy="35"
    stroke-width="0.5"
    stroke-linecap="round"
    stroke="currentColor"
    fill="none"
  )
  rect(
    x="0"
    y="0"
    width="100"
    height="70"
    stroke="currentColor"
    fill="none"
    stroke-width="2"
    rx="2"
  )
</template>

<style lang="postcss" scoped>

</style>