<template lang="pug">
g(
  @mousedown="$emit('mute')"
)
  svg-ring(
    :from="(step - 1) / total * 360"
    :to="(step) / total * 360"
    :fill="color"
    :radius="radius + 50"
    :op="active ? 1 : 0.1"
  )
  line(
    :x1="lineCoord[0].x"
    :y1="lineCoord[0].y"
    :stroke-width="muted ? 2 : 4"
    :stroke="!muted ? color : 'currentColor'"
    stroke-linecap="round"
    :opacity="muted ? 0.5 : 1"
    :x2="lineCoord[1].x"
    :y2="lineCoord[1].y"
  )
  circle.transition-all.duration-100.ease-out(
    :cx="stepCoord.x"
    :cy="stepCoord.y"
    :r="25"
    :stroke ="active ? 'currentColor' : color"
    :fill="active ? 'currentColor' : accented ? color : 'transparent'"
    :opacity="muted ? 0 : 1"
    stroke-width="4"
    @mousedown.stop="muted ? $emit('mute') : $emit('accent')"

  )
  circle.transition-all.duration-100.ease-out(
    :cx="getCircleCoord(step - 1, total, radius - 50, 1000).x"
    :cy="getCircleCoord(step - 1, total, radius - 50, 1000).y"
    :r="muted ? 4 : 8"
    :stroke ="active ? 'currentColor' : muted ? 'transparent' : color"
    :fill="muted ? 'currentColor' : color"
    :opacity="muted ? 0.5 : 1"
    stroke-width="4"
    stroke-linecap="round"
  )
  text(
    :opacity="muted ? 0.2 : 1"
    style="user-select:none;pointer-events:none;transition:all 200ms ease"
    :fill="!active ? 'currentColor' : 'var(--c-bg)'"
    font-family="Commissioner, sans-serif"
    font-size="36px"
    text-anchor="middle",
    dominant-baseline="middle"
    :x="stepCoord.x",
    :y="stepCoord.y + 4",
  ) {{ step }}


</template>

<script setup>
import { levelColor } from "@use/colors.js"
import { getCircleCoord } from 'chromatone-theory'
import { colord } from 'colord'
import { tempo } from '@use/tempo'

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
  },
  muted: {
    type: Boolean,
    default: false,
  },
  accented: {
    type: Boolean,
    default: false,
  },
});

const color = computed(() => {
  return levelColor(props.step - 1 + (tempo.pitch / 12) * props.total, props.total, 1)
})

const stepCoord = computed(() => {
  return getCircleCoord(props.step - 1, props.total, props.radius + 25, 1000)
})

const lineCoord = computed(() => {
  return [
    getCircleCoord(props.step - 1, props.total, props.radius - (props.muted ? 25 : 0), 1000),
    getCircleCoord(props.step - 1, props.total, props.radius - 50, 1000)
  ]

});
</script>

<style scoped>
</style>