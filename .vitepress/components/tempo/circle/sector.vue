<template lang="pug">
g(
)
  circle.transition-fill.duration-100(
    :cx="stepCoord.x"
    :cy="stepCoord.y"
    :r="100"
    :fill="active ? 'currentColor' : 'transparent'"
    :stroke="!active ? 'currentColor' : 'transparent'"
  )
  text(
    style="user-select:none;transition:all 200ms ease"
    :fill="!active ? 'currentColor' : 'var(--c-bg)'"
    font-family="Commissioner, sans-serif"
    font-size="42px"
    text-anchor="middle",
    dominant-baseline="middle"
    :x="stepCoord.x",
    :y="stepCoord.y + 0.5",
  ) {{ step }}
  line(
    style="mix-blend-mode:difference;"
    :x1="lineCoord[0].x"
    :y1="lineCoord[0].y"
    stroke-width="2"
    stroke="currentColor"
    stroke-linecap="cound"
    :x2="lineCoord[1].x"
    :y2="lineCoord[1].y"
  )
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { getCircleCoord } from 'chromatone-theory'
const props = defineProps({
  step: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 4
  },
  active: {
    type: Boolean,
    default: false
  }
});

const stepCoord = computed(() => {

  return getCircleCoord(props.step - 0.5, props.total, 400, 1000)

})

const lineCoord = computed(() => {

  return [
    getCircleCoord(props.step, props.total, 450, 1000),
    getCircleCoord(props.step, props.total, 350, 1000)
  ]

})
</script>

<style scoped>
</style>