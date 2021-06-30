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
    ) M
    text.font-bold.text-xs(
      x="78"
      y="78"
      text-anchor="middle"
      fill="white"
    ) Y
  .flex.flex-wrap.justify-center
    .flex.flex-col.items-center.p-2
      label(for="cyan") CYAN {{ mix.c }}
      input(type="range" v-model="mix.c" min="0" max="100" id="cyan")
    .flex.flex-col.items-center.p-2
      label(for="magenta") MAGENTA {{ mix.m }}
      input(type="range" v-model="mix.m" min="0" max="100" id="magenta")
    .flex.flex-col.items-center.p-2
      label(for="yellow") YELLOW {{ mix.y }}
      input(type="range" v-model="mix.y" min="0" max="100" id="yellow")
    .flex.flex-col.items-center.p-2
      label(for="black") BLACK {{ mix.k }}
      input(type="range" v-model="mix.k" min="0" max="100" id="black")
</template>

<script setup>
import { defineProps, reactive } from 'vue'
const props = defineProps({

});

const mix = reactive({
  radius: 30,
  c: 100,
  m: 100,
  y: 100,
  k: 0,
});
</script>

<style scoped>
</style>