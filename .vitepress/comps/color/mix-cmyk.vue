<template lang="pug">
.flex.flex-col.items-center.mb-8
  svg.max-h-3xl.w-full(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 100 100",
    xmlns="http://www.w3.org/2000/svg",
    )
    circle.mix-blend-multiply(
      :r="mix.radius"
      cx="50"
      cy="40"
      :fill="`hsla(180,100%,50%,${mix.c / 100})`"
    )
    circle.mix-blend-multiply(
      :r="mix.radius"
      cx="65"
      cy="65"
      :fill="`hsla(300,100%,50%,${mix.m / 100})`"
    )
    circle.mix-blend-multiply(
      :r="mix.radius"
      cx="35"
      cy="65"
      :fill="`hsla(60,100%,50%,${mix.y / 100})`"
    )
    circle.mix-blend-multiply(
      r="18"
      cx="50"
      cy="57"
      :fill="`hsla(60,0%,0%,${mix.k / 100})`"
    )
    text.font-bold.text-xs(
      x="50"
      y="30"
      text-anchor="middle"
      fill="white"
    ) C
    text.font-bold.text-xs(
      x="22"
      y="78"
      text-anchor="middle"
      fill="white"
    ) Y
    text.font-bold.text-xs(
      x="78"
      y="78"
      text-anchor="middle"
      fill="white"
    ) M
    text(
      x="50"
      y="48"
      font-size="2px"
      text-anchor="middle"
      :fill="mix.info.dark ? '#FFF' : '#000'"
    ) 
      tspan.font-bold {{ mix.info.hex }}
      tspan.font-bold.text-3px(x="50" dy="4") {{ mix.info.name }} 
      tspan(x="50" dy="4") {{ mix.info.rgb }}
      tspan(x="50" dy="4") {{ mix.info.hsl }}
      tspan(x="50" dy="4") {{ mix.info.cmyk }}
  .flex.flex-col.items-center 
  .flex.flex-wrap.justify-center
    .flex.flex-col.items-center.p-2
      label(for="cyan" style="color:cyan") CYAN {{ mix.c }}
      input(type="range" v-model="mix.c" min="0" max="100" id="cyan")
    .flex.flex-col.items-center.p-2
      label(for="magenta" style="color:magenta") MAGENTA {{ mix.m }}
      input(type="range" v-model="mix.m" min="0" max="100" id="magenta")
    .flex.flex-col.items-center.p-2
      label(for="yellow" style="color:yellow") YELLOW {{ mix.y }}
      input(type="range" v-model="mix.y" min="0" max="100" id="yellow")
    .flex.flex-col.items-center.p-2
      label(for="black" style="color:black") BLACK {{ mix.k }}
      input(type="range" v-model="mix.k" min="0" max="100" id="black")
</template>

<script setup>
import { getColorInfo } from '@use/colors.js'
const mix = reactive({
  radius: 30,
  c: 100,
  m: 100,
  y: 100,
  k: 0,
  cmyk: computed(() => `device-cmyk(${mix.c}%, ${mix.m}%, ${mix.y}%, ${mix.k}% / 100%)`),
  info: computed(() => getColorInfo({ c: mix.c, m: mix.m, y: mix.y, k: mix.k, a: 1 }))
});
</script>

<style scoped>
</style>