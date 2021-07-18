<template lang="pug">
.flex.flex-col.items-center.mb-8
  svg.max-h-3xl.w-full(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 100 100",
    xmlns="http://www.w3.org/2000/svg",
    )
    circle.mix-blend-lighten(
      :r="mix.radius"
      cx="50"
      cy="40"
      :fill="`rgb(${mix.r},0,0)`"
    )
    circle.mix-blend-lighten(
      :r="mix.radius"
      cx="65"
      cy="65"
      :fill="`rgb(0,${mix.g},0)`"
    )
    circle.mix-blend-lighten(
      :r="mix.radius"
      cx="35"
      cy="65"
      :fill="`rgb(0,0,${mix.b})`"
    )
    text.font-bold.text-xs(
      x="50"
      y="30"
      text-anchor="middle"
      fill="white"
    ) R
    text.font-bold.text-xs(
      x="22"
      y="78"
      text-anchor="middle"
      fill="white"
    ) B
    text.font-bold.text-xs(
      x="78"
      y="78"
      text-anchor="middle"
      fill="white"
    ) G
    text(
      x="50"
      y="60"
      font-size="2px"
      text-anchor="middle"
      fill="black"
    ) rgb({{ mix.r }}, {{ mix.g }}, {{ mix.b }})
  .flex.flex-wrap.justify-center
    .flex.flex-col.items-center.p-2
      label(for="red" style="color:#FF0000") RED {{ mix.r }}
      input(type="range" v-model="mix.r" min="0" max="255" id="red")
    .flex.flex-col.items-center.p-2
      label(for="green" style="color:#00FF00") GREEN {{ mix.g }}
      input(type="range" v-model="mix.g" min="0" max="255" id="green")
    .flex.flex-col.items-center.p-2
      label(for="blue" style="color:#0000FF") BLUE {{ mix.b }}
      input(type="range" v-model="mix.b" min="0" max="255" id="blue")
</template>

<script setup>
import { reactive } from 'vue'


const mix = reactive({
  radius: 30,
  r: 255,
  g: 255,
  b: 255,
});
</script>

<style scoped>
</style>