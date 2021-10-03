<template lang="pug">
g.cursor-pointer(
)
  rect.transition-fill.duration-100(
    :width="proportion * 1000"
    height="180"
    :fill="active ? hex : 'transparent'"
    :stroke="hex"
  )
  text(
    y="80"
    font-size="40"
    text-anchor="middle"
    :x="proportion * 1000 / 2"
  ) {{ step }}
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
    type: [Number, Array],
    default: 1
  },
  total: {
    type: Number,
    default: 4
  },
  active: {
    type: Boolean,
    default: false
  },
});


const hex = computed(() => {
  return colord(levelColor(props.step - 1, props.total, 1)).toHex()
});
</script>

<style scoped>
</style>