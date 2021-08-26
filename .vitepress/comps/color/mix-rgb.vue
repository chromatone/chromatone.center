<template lang="pug">
.flex.flex-col.items-center.mb-8
  svg.max-h-3xl.w-full(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 100 100",
    xmlns="http://www.w3.org/2000/svg",
    stroke-width="2px"
    )
    circle#r.mix-blend-lighten(
      v-drag="onDrag"
      :r="mix.radius"
      cx="35"
      cy="40"
      :fill="`rgb(${mix.r},0,0)`"
      stroke="#ff0000"
      stroke-linecap="round"
      :stroke-dashoffset="mix.len - mix.len * (mix.r / mix.max)"
      :stroke-dasharray="mix.len"
      transform-origin="35 40"
      transform="rotate(-150)"
    )
    circle#g.mix-blend-lighten(
      v-drag="onDrag"
      :r="mix.radius"
      cx="65"
      cy="40"
      :fill="`rgb(0,${mix.g},0)`"
      stroke="#00ff00"
      stroke-linecap="round"
      :stroke-dashoffset="mix.len - mix.len * (mix.g / mix.max)"
      :stroke-dasharray="mix.len"
      transform-origin="65 40"
      transform="rotate(-30)"
    )
    circle#b.mix-blend-lighten(
      v-drag="onDrag"
      :r="mix.radius"
      cx="50"
      cy="68"
      :fill="`rgb(0,0,${mix.b})`"
      stroke="#0000ff"
      stroke-linecap="round"
      :stroke-dashoffset="mix.len - mix.len * (mix.b / mix.max)"
      :stroke-dasharray="mix.len"
      transform-origin="50 68"
      transform="rotate(90)"
    )
    text.font-bold.text-xs.pointer-events-none(
      x="20"
      y="35"
      text-anchor="middle"
      fill="white"
    ) R
    text.font-bold.text-xs.pointer-events-none(
      x="50"
      y="88"
      text-anchor="middle"
      fill="white"
    ) B
    text.font-bold.text-xs.pointer-events-none(
      x="80"
      y="35"
      text-anchor="middle"
      fill="white"
    ) G
    color-svg-info(:color="mix.rgb" :y="42")
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
const mix = reactive({
  radius: 30,
  len: computed(() => mix.radius * Math.PI * 2),
  max: 255,
  r: useStorage('red', 100),
  g: useStorage('gree', 100),
  b: useStorage('blue', 100),
  rgb: computed(() => `rgb(${mix.r},${mix.g},${mix.b})`)
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
circle {
  @apply cursor-pointer;
}
</style>