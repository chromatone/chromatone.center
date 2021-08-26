<template lang="pug">
.flex.flex-col.items-center.mb-8
  svg.max-h-3xl.w-full(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 100 100",
    xmlns="http://www.w3.org/2000/svg",
    stroke-width="2px"
    )
    circle#c.mix-blend-multiply(
      v-drag="onDrag"
      :r="mix.radius"
      cx="50"
      cy="40"
      stroke="cyan"
      stroke-linecap="round"
      :stroke-dashoffset="mix.len - mix.len * (mix.c / mix.max)"
      :stroke-dasharray="mix.len"
      transform-origin="50 40"
      transform="rotate(-90)"
      :fill="`hsla(180,100%,50%,${mix.c / 100})`"
    )
    circle#m.mix-blend-multiply(
      v-drag="onDrag"
      :r="mix.radius"
      cx="65"
      cy="65"
      stroke="magenta"
      stroke-linecap="round"
      :stroke-dashoffset="mix.len - mix.len * (mix.m / mix.max)"
      :stroke-dasharray="mix.len"
      :fill="`hsla(300,100%,50%,${mix.m / 100})`"
    )
    circle#y.mix-blend-multiply(
      v-drag="onDrag"
      :r="mix.radius"
      cx="35"
      cy="65"
      stroke="yellow"
      stroke-linecap="round"
      :stroke-dashoffset="mix.len - mix.len * (mix.y / mix.max)"
      :stroke-dasharray="mix.len"
      transform-origin="35 65"
      transform="rotate(180)"
      :fill="`hsla(60,100%,50%,${mix.y / 100})`"
    )
    circle#k.mix-blend-multiply(
      v-drag="onDrag"
      r="18"
      cx="50"
      cy="57"
      stroke="black"
      stroke-linecap="round"
      transform-origin="50 57"
      transform="rotate(90)"
      :stroke-dashoffset="18 * Math.PI * 2 * (1 - (mix.k / mix.max))"
      :stroke-dasharray="18 * Math.PI * 2"
      :fill="`hsla(60,0%,0%,${mix.k / 100})`"
    )
    text.font-bold.text-xs.pointer-events-none(
      x="50"
      y="30"
      text-anchor="middle"
      fill="white"
    ) C
    text.font-bold.text-xs.pointer-events-none(
      x="22"
      y="78"
      text-anchor="middle"
      fill="white"
    ) Y
    text.font-bold.text-xs.pointer-events-none(
      x="78"
      y="78"
      text-anchor="middle"
      fill="white"
    ) M
    color-svg-info(:color="{ c: mix.c, m: mix.m, y: mix.y, k: mix.k, a: 1 }")
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
const mix = reactive({
  radius: 30,
  len: computed(() => mix.radius * Math.PI * 2),
  max: 100,
  c: useStorage('cyan', 50),
  m: useStorage('magenta', 50),
  y: useStorage('yellow', 50),
  k: useStorage('black', 10),
  cmyk: computed(() => `device-cmyk(${mix.c}%, ${mix.m}%, ${mix.y}%, ${mix.k}% / 100%)`),
});

function onDrag(drag) {
  let id = drag.event.target.id
  mix[id] = Number(mix[id]) + (Number(drag.delta[0]) - Number(drag.delta[1]))
  if (mix[id] < 0) {
    mix[id] = 0
  }
  if (mix[id] > mix.max) {
    mix[id] = mix.max
  }
}
</script>

<style scoped>
</style>