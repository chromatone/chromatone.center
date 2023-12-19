<script setup>
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { reactive, ref, computed } from 'vue'
import { useGesture } from '@vueuse/gesture';

const mix = reactive({
  radius: 30,
  len: computed(() => mix.radius * Math.PI * 2),
  max: 255,
  r: useClamp(useStorage('red', 190), 0, 255),
  g: useClamp(useStorage('gree', 190), 0, 255),
  b: useClamp(useStorage('blue', 190), 0, 255),
  rgb: computed(() => `rgb(${mix.r},${mix.g},${mix.b})`)
});

function useDrag(channel) {
  return (delta) => {
    mix[channel] = Number(mix[channel]) + (Number(delta[0]) - Number(delta[1]))
  }
}

const controlR = ref()
const controlG = ref()
const controlB = ref()

useGesture({
  onDrag(ev) {
    ev?.event?.preventDefault()
    useDrag('r')(ev.delta)
  },
  onWheel(ev) {
    ev?.event?.preventDefault()
    useDrag('r')(ev.velocities.map(v => -v))
  }
}, {
  domTarget: controlR,
  eventOptions: { passive: false }
})

useGesture({
  onDrag(ev) {
    ev?.event?.preventDefault()
    useDrag('g')(ev.delta)
  },
  onWheel(ev) {
    ev?.event?.preventDefault()
    useDrag('g')(ev.velocities.map(v => -v))
  }
}, {
  domTarget: controlG,
  eventOptions: { passive: false }
})

useGesture({
  onDrag(ev) {
    ev?.event?.preventDefault()
    useDrag('b')(ev.delta)
  },
  onWheel(ev) {
    ev?.event?.preventDefault()
    useDrag('b')(ev.velocities.map(v => -v))
  }
}, {
  domTarget: controlB,
  eventOptions: { passive: false }
})


</script>

<template lang="pug">
#screen.fullscreen-container.mb-8.p-4.rounded-xl.transition-all.duration-800.ease-out(:style="{ backgroundColor: mix.rgb }")
  svg.min-h-80svh.max-h-100svh.w-full(
    version="1.1",
    baseProfile="full",
    viewBox="-5 -5 110 110",
    xmlns="http://www.w3.org/2000/svg",
    stroke-width="2px"
    style="touch-action: none;"
    font-family="Commissioner, sans-serif"
    )
    circle#black(
      r="50"
      cx=50
      cy=50
      )
    g#sources
      circle(
        r=8
        cx=15
        cy=29
        fill="#ff0000"
        )
      circle(
        r=8
        cx=85.5
        cy=29
        fill="#00ff00"
        )
      circle(
        r=8
        cx=50
        cy=91
        fill="#0000ff"
        )
    g#circles.cursor-pointer(

      stroke-linecap="round"
      :stroke-dasharray="mix.len"
      )
      circle#r.mix-blend-lighten(
        :r="mix.radius"
        ref="controlR"
        :fill="`rgb(${mix.r},0,0)`"
        stroke="#ff0000"
        :stroke-dashoffset="mix.len - mix.len * (mix.r / mix.max)"
        transform="translate(35,40) rotate(-150)"
        )

      circle#g.mix-blend-lighten(
        :r="mix.radius"
        ref="controlG"
        :fill="`rgb(0,${mix.g},0)`"
        stroke="#00ff00"
        :stroke-dashoffset="mix.len - mix.len * (mix.g / mix.max)"
        transform="translate(65,40) rotate(-30)"
        )
      circle#b.mix-blend-lighten(
        :r="mix.radius"
        ref="controlB"
        :fill="`rgb(0,0,${mix.b})`"
        stroke="#0000ff"
        :stroke-dashoffset="mix.len - mix.len * (mix.b / mix.max)"
        transform="translate(50,68) rotate(90)"
        )
    g#text.font-bold.text-xs.select-none
      text(
        x="15"
        y="33"
        text-anchor="middle"
        fill="white"
      ) R
      text(
        x="50"
        y="95"
        text-anchor="middle"
        fill="white"
      ) B
      text(
        x="85"
        y="33"
        text-anchor="middle"
        fill="white"
      ) G
      color-svg-info(transform="scale(0.7) translate(21,12)" :color="mix.rgb" :y="46")
</template>

<style lang="postcss" scoped></style>