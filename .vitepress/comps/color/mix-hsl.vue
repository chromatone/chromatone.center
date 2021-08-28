<template lang="pug">
.flex.flex-col.items-center.mb-8.p-4
  svg.min-h-xl.max-h-3xl.w-full(
    version="1.1",
    baseProfile="full",
    viewBox="-15 -5 130 115",
    xmlns="http://www.w3.org/2000/svg",
    stroke-width="2px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    style="touch-action: pinch-zoom; user-select:none"
    )
    defs
      linearGradient#sat(x1="0" x2="0" y1="0" y2="1")
        stop(
          v-for="(step,i) in 10" :key="step"
          :stop-color="generateTone(mix.hue, 100 - i * 10).toHex()" :offset="i * 10 + '%'"
          )
      linearGradient#light(x1="0" x2="0" y1="0" y2="1")
        stop(
          v-for="(step,i) in 10" :key="step"
          :stop-color="generateTone(mix.hue, mix.sat, 100 - i * 10).toHex()" :offset="i * 10 + '%'"
          )
    g#spaces
      g.cursor-pointer(
        v-for="(space,i) in spaces" :key="space"
        font-size="3"
        :transform="`translate(${12 * (i - 1) + 50}, 0)`"
        @click="mix.space = space"
      )
        rect(
          rx="1" x="-5" y="-3" 
          width="10" height="5" 
          :fill="space == mix.space ? '#aaa' : '#ccc'" stroke="currentColor"
          stroke-width="0.2")
        text.uppercase(:font-weight="space == mix.space ? 'bold' : 'normal'") {{ space }}
    g#count.cursor-pointer(
      :transform="`translate(50, 102)`"
      font-size="2"
      v-drag="onDragSteps"
    )
      rect(
        x="-20" y="-2.5" 
        width="40" height="4" 
        fill="#ccc" stroke="currentColor"
        stroke-width="0.2")
      rect( 
        x="-20" y="-2.5" 
        :width="40 * (mix.hueCount / 60)" height="4" 
        fill="#aaa" stroke="currentColor"
        stroke-width="0.2")
      text.uppercase {{ mix.hueCount }} HUE STEPS 
    g#circle.cursor-pointer(v-drag="onDrag" :drag-options="{ filterTaps: true }")
      g.arc(
        v-for="(arc,i) in mix.hueArcs" :key="arc"
      )
        svg-ring.sector(
          :cx="50"
          :cy="50"
          :radius="45"
          :thickness="27"
          :from="arc.from"
          :to="arc.to"
          :fill="generateTone(arc.from).toHex()"
          :stroke="generateTone(arc.from).toHex()"
          @click="mix.hue = arc.from"
        )
      g#coords.mix-blend-difference
        circle(
          :cx="50"
          :cy="50"
          :r="mix.sat * 0.27 + 18"
          fill="none"
          stroke="white"
          stroke-width="0.2"
        )
        line.transition-all.duration-200(
          ref="arrow"
          x1=0
          x2=0
          y1=45
          y2=0
          stroke-width="0.2"
          stroke="white"
          :transform="`translate(50,50) rotate(${angle - 180 + 180 / mix.hueCount})`"
        )
      g#current
        circle(
          :fill="mix.current"
          cx="50"
          cy="50"
          r="18"
        )
        color-svg-info(:color="mix.current" :y="40")
    g#l-range.cursor-pointer
      rect#light(
        x="100"
        y="0"
        width="10"
        height="100"
        fill="url(#light)"
        v-drag="onDragL"
      )
      g.pointer-events-none(
        :transform="`translate(0,${100 - mix.light})`"
      )
        line.mix-blend-difference(
          x1="100"
          x2="110"
          stroke="currentColor"
          stroke-linecap="round"
        )
        text(
          font-size="3px"
          x="101"
          y="-2"
        ) L {{ mix.light.toFixed(1) }}
    g#s-range.cursor-pointer
      rect#sat(
        x="-10"
        y="0"
        width="10"
        height="100"
        fill="url(#sat)"
        v-drag="onDragS"
      )
      g.pointer-events-none(
        :transform="`translate(0,${100 - mix.sat})`"
      )
        line.mix-blend-difference(
          x1="-10"
          x2="0"
          stroke="currentColor"
          stroke-linecap="round"
        )
        text(
          font-size="3px"
          x="-9"
          y="-2"
        ) {{ paramNames[mix.space][1] }} {{ mix.sat.toFixed(1) }}
</template>

<script setup>
import { colord } from 'colord'
import { useTransition, TransitionPresets } from '@vueuse/core'


const mix = reactive({
  current: computed(() => generateTone(mix.hue).toHex()),
  space: useStorage('color-space', 'lch'),
  ring: useStorage('color-rings', 'tints'),
  hueCount: useStorage('hueCount', 12),
  toneCount: useStorage('toneCount', 6),
  hue: useStorage('hue', 50),
  sat: useStorage('saturation', 50),
  light: useStorage('lightness', 50),
  hsl: computed(() => `hsla(${mix.hue},${mix.sat}%,${mix.light}%,1)`),
  hueSteps: computed(() => [...Array(mix.hueCount)].map((step, i) => 360 * i / mix.hueCount)),
  hueArcs: computed(() => mix.hueSteps.map((step, i, arr) => ({ from: step, to: arr[i + 1] || arr[0] }))),
});

const spaces = ['hsl', 'lch', 'hwb']

const paramNames = {
  hsl: ['Hue', 'S', 'L'],
  lch: ['Hue', 'C', 'L'],
  hwb: ['Hue', 'B', 'W',]
}

const angle = useTransition(computed(() => mix.hue), {
  duration: 400,
  transition: TransitionPresets.easeInOutCubic,
})

function generateTone(hue = mix.hue, sat = mix.sat, light = mix.light) {
  if (mix.space == 'lch') {
    return colord(`lch(${light}% ${sat} ${hue} / 1)`)
  } else if (mix.space == 'hsl') {
    return colord(`hsl(${hue}, ${sat}%, ${light}%)`)
  } else {
    return colord({ h: hue, w: light, b: sat, a: 1 })
  }
}

function onDragSteps(drag) {
  mix.hueCount = clampNum(mix.hueCount, drag.delta[0], 2, 60)
}

function onDrag(drag) {
  mix.light = clampNum(mix.light, -drag.delta[1] / 8)
  mix.sat = clampNum(mix.sat, drag.delta[0] / 8)
}

function onDragL(drag) {
  mix.light = clampNum(mix.light, -drag.delta[1] / 8)
}

function onDragS(drag) {
  mix.sat = clampNum(mix.sat, -drag.delta[1] / 8)
}

function clampNum(main, delta, min = 0, max = 100) {
  let num = Number(main) + Number(delta)
  if (num < min) {
    num = min
  }
  if (num > max) {
    num = max
  }
  return num
}

</script>

<style scoped>
</style>