<template lang="pug">
g.cursor-pointer(
)
  rect.transition-fill.duration-100(
    @click="$emit('mute')"
    :width="proportion * 1000"
    height="100"
    :fill="active ? levelColor(props.step - 1, props.total, 1) : 'transparent'"
    :stroke="levelColor(props.step - 1, props.total, 1)"
  )
  text(
    y="60"
    font-size="40"
    text-anchor="middle"
    :x="proportion * 1000 / 2"
  ) {{ step }}
  g.sub(
    @click="$emit('subdivide', [`${step}-1`, `${step}-2`])"
  )
    rect(
      v-for="(sub,s) in subdivisions" :key="sub"
      :width="proportion * 1000 / subdivisions.length"
      height="80"
      y="100"
      :data-s="sub"
      :x="s * proportion * 1000 / subdivisions.length"
      :fill="sub == current ? levelColor(s, subdivisions.length, 0.5) : 'transparent'"
    )
</template>

<script setup>
import { levelColor } from "@use/colors.js"
import { colord } from 'colord'

const props = defineProps({
  proportion: {
    type: Number,
    default: 1
  },
  step: {
    type: Number,
    default: 1
  },
  subdivisions: {
    type: Array,
    default: []
  },
  total: {
    type: Number,
    default: 4
  },
  active: {
    type: Boolean,
    default: false
  },
  current: {
    type: [Number, String],
    default: 0
  },
});


</script>

<style scoped>
</style>