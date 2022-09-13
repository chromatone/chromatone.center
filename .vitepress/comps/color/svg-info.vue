<script setup>
import { getColorInfo } from '#use/colors.js'
const props = defineProps({
  color: {
    type: [String, Object]
  },
  x: {
    type: Number,
    default: 36
  },
  y: {
    type: Number,
    default: 48
  }
})
const info = computed(() => getColorInfo(props.color));

const dy = 4.8

</script>

<template lang="pug">
g
  text.select-none(

    v-if="info"
    :x="x"
    :y="y"
    font-size="2.6"
    text-anchor="middle"
    :fill="info.dark ? '#FFF' : '#000'"
  ) 
    color-copy.font-bold.text-3px(x="51" dy="1" :text="info.hex")
    tspan.font-bold.text-4px(x="50" dy="5") {{ info.name }} 

    color-copy(x="51" :dy="dy+3" :text="info.rgb")
    color-copy(x="51" :dy="dy" :text="info.hsl") 
    color-copy(x="51" :dy="dy" :text="` lab(${ info.lab.l }, ${ info.lab.a }, ${ info.lab.b })`")
    color-copy(x="51" :dy="dy" :text="info.cmyk.slice(7)")

</template>

<style lang="postcss" scoped>

</style>