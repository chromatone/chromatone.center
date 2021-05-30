<template lang="pug">
g(
)
  svg-arc(
    :from="(step - 1) / total * 360"
    :to="(step) / total * 360"
    :fill="active ? levelColor(step - 1, total) : 'transparent'"
    :radius="radius + 50"
    opacity="0.5"
  )
  circle.transition-fill.duration-100(
    :cx="stepCoord.x"
    :cy="stepCoord.y"
    :r="50"
    :fill="active ? 'currentColor' : 'transparent'"
    :stroke="levelColor(step - 1, total)"
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
import { levelColor } from "@theme/composables/colors.js";
import { getCircleCoord } from 'chromatone-theory'
const props = defineProps({
  radius: {
    type: Number,
    default: 400,
  },
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

  return getCircleCoord(props.step - 0.5, props.total, props.radius, 1000)

})

const lineCoord = computed(() => {

  return [
    getCircleCoord(props.step, props.total, props.radius + 50, 1000),
    getCircleCoord(props.step, props.total, props.radius - 50, 1000)
  ]

})
</script>

<style scoped>
</style>