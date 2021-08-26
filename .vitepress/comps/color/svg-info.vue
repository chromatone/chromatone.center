<template lang="pug">
text.select-none.pointer-events-none(
  v-if="info"
  :x="x"
  :y="y"
  font-size="2px"
  text-anchor="middle"
  :fill="info.dark ? '#FFF' : '#000'"
) 
  tspan.font-bold {{ info.hex }}
  tspan.font-bold.text-3px(x="50" dy="4") {{ info.name }} 
  tspan(x="50" dy="4") {{ info.rgb }}
  tspan(x="50" dy="4") {{ info.hsl }}
  tspan(x="50" dy="4") {{ info.cmyk }}
</template>

<script setup>
import { getColorInfo } from '@use/colors.js'
const props = defineProps({
  color: {
    type: [String, Object]
  },
  x: {
    type: Number,
    default: 50
  },
  y: {
    type: Number,
    default: 48
  }
})
const info = computed(() => getColorInfo(props.color));
</script>

<style scoped>
</style>