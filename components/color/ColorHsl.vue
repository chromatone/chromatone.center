<script setup>
import { getColorInfo } from '#/use/colors'
import { colord } from 'colord'
import { useTransition, TransitionPresets, useStorage } from '@vueuse/core'
import { useClamp } from '@vueuse/math';
import { reactive, ref, computed } from 'vue'
import { useGesture } from '@vueuse/gesture';

import { useSpring } from 'vue-use-spring'

const harmonies = {
  monochromatic: [0],
  diad: [0, 60],
  complementary: [0, 180],
  analogous: [330, 0, 30],
  'split-complementary': [0, 150, 210],
  triad: [0, 120, 240],
  'double complementary': [0, 30, 180, 210],
  'rectangular tetrad': [0, 60, 180, 240],
  'square tetrad': [0, 90, 180, 270],
  pentagon: [0, 60, 150, 210, 300]
}

const mix = reactive({
  harmony: 'monochromatic',
  current: computed(() => generateTone(mix.hue).toHex()),
  info: computed(() => getColorInfo(mix.current)),
  space: useStorage('color-space', 'Lch'),
  ring: useStorage('color-rings', 'tints'),
  hueCount: useClamp(useStorage('hueCount', 12), 2, 60),
  toneCount: useStorage('toneCount', 6),
  hue: useStorage('hue', 50),
  sat: useClamp(useStorage('saturation', 50), 0, 100),
  light: useClamp(useStorage('lightness', 50), 0, 100),
  hsl: computed(() => `hsla(${mix.hue},${mix.sat}%,${mix.light}%,1)`),
  hueSteps: computed(() => [...Array(mix.hueCount)].map((step, i) => 360 * i / mix.hueCount)),
  hueArcs: computed(() => mix.hueSteps.map((step, i, arr) => ({ from: step, to: arr[i + 1] || 359.9 }))),
  dark: computed(() => colord(mix.current).isDark())
});

const spaces = ['HSL', 'Lch', 'HWB']

const paramNames = {
  HSL: ['Hue', 'S', 'L'],
  Lch: ['Hue', 'C', 'L'],
  HWB: ['Hue', 'B', 'W',]
}

const angle = useSpring(mix)

function generateTone(hue = mix.hue, sat = mix.sat, light = mix.light) {
  if (mix.space == 'Lch') {
    return colord(`lch(${light}% ${sat} ${hue} / 1)`)
  } else if (mix.space == 'HSL') {
    return colord(`hsl(${hue}, ${sat}%, ${light}%)`)
  } else {
    return colord({ h: hue, w: light, b: sat, a: 1 })
  }
}

const stepsControl = ref()
useGesture({
  onDrag(ev) {
    ev?.event?.preventDefault()
    mix.hueCount += ev.delta[0]
  },
  onWheel(ev) {
    ev?.event?.preventDefault()
    mix.hueCount -= ev.delta[0]
  }
}, {
  domTarget: stepsControl,
  eventOptions: { passive: false }
})

const lightControl = ref()
useGesture({
  onDrag(ev) {
    ev?.event?.preventDefault()
    mix.light -= ev.delta[1] / 8
  },
  onWheel(ev) {
    ev?.event?.preventDefault()
    mix.light += ev.delta[1] / 8
  }
}, {
  domTarget: lightControl,
  eventOptions: { passive: false }
})

const satControl = ref()
useGesture({
  onDrag(ev) {
    ev?.event?.preventDefault()
    mix.sat -= ev.delta[1] / 8
  },
  onWheel(ev) {
    ev?.event?.preventDefault()
    mix.sat += ev.delta[1] / 8
  }
}, {
  domTarget: satControl,
  eventOptions: { passive: false }
})

const centerControl = ref()
useGesture({
  onDrag(ev) {
    ev?.event?.preventDefault()
    mix.hue += ev.delta[0] / 8
    mix.sat -= ev.delta[1] / 8
  },
  onWheel(ev) {
    ev?.event?.preventDefault()
    mix.hue -= ev.delta[0] / 8
    mix.sat += ev.delta[1] / 8
  }
}, {
  domTarget: centerControl,
  eventOptions: { passive: false }
})

</script>

<template lang="pug">
.fullscreen-container.p-4.transition-all.duration-800.ease-out#screen(:style="{ backgroundColor: mix.current }")
  svg.max-h-3xl.w-full(
    version="1.1",
    baseProfile="full",
    viewBox="-15 -5 130 115",
    xmlns="http://www.w3.org/2000/svg",
    stroke-width="2px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    style="touch-action: none; user-select:none"
    :style="{ color: mix.dark ? 'white' : 'black' }"
    )
    defs
      linearGradient#sat(x1="0" x2="0" y1="0" y2="1")
        stop(
          v-for="(step, i) in 10" :key="step"
          :stop-color="generateTone(mix.hue, 100 - i * 10).toHex()" :offset="i * 10 + '%'"
          )
      linearGradient#light(x1="0" x2="0" y1="0" y2="1")
        stop(
          v-for="(step, i) in 10" :key="step"
          :stop-color="generateTone(mix.hue, mix.sat, 100 - i * 10).toHex()" :offset="i * 10 + '%'"
          )
    g#spaces
      g.cursor-pointer(
        v-for="(space, i) in spaces" :key="space"
        font-size="3"
        :transform="`translate(${12 * (i - 1) + 50}, 0)`"
        @click="mix.space = space"
      )
        rect(
          rx="1" x="-5" y="-3" 
          width="10" height="5" 
          :fill="space == mix.space ? '#aaa' : '#ccc'" stroke="currentColor"
          stroke-width="0.2")
        text(:font-weight="space == mix.space ? 'bold' : 'normal'") {{ space }}
    g#count.cursor-pointer(
      :transform="`translate(50, 102)`"
      font-size="2"
      ref="stepsControl"
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
    g#circle.cursor-pointer(ref="centerControl")
      g.arc(
        v-for="(arc, i) in mix.hueArcs" :key="arc"
        :data-from="arc.from"
        :data-to="arc.to"
        )
        svg-ring.sector(
          :cx="50"
          :cy="50"
          :radius="45"
          :thickness="27"
          :from="arc.from"
          :to="arc.to"
          :fill="generateTone(arc.from).toHex()"
          @mousedown="mix.hue = arc.from"
          @touchstart="mix.hue = arc.from"
        )
    g#coords.pointer-events-none(
      :stroke="mix.info.dark ? 'white' : 'black'"
      )
        circle(
          :cx="50"
          :cy="50"
          :r="mix.sat * 0.27 + 18"
          fill="none"
          stroke-width="0.2"
        )
        g#lines(
          :transform="`translate(50,50) rotate(${angle.hue - 180 + 180 / mix.hueCount})`" 
          stroke-width="0.4"
          )
          line(
            x1=0
            x2=0
            y1=45
            y2=0
            stroke-width="0.6"
          )
          line(
            v-for="angle in harmonies[mix.harmony]" 
            :key="angle"
            :y1="mix.sat * 0.27 + 18"
            :transform="`rotate(${angle})`"
          )
          circle(
            :cy="mix.sat * 0.27 + 18"
            r="3"
            :fill="mix.current"
          )
    g#current(

      )
      circle(
        :fill="mix.current"
        cx="50"
        cy="50"
        r="18"

        )
      color-svg-info(
        transform="scale(0.8) translate(12,5)" 
        :color="mix.current" 
        :y="40")
      text(
        x="50"
        y="64"
        font-size="4"
        fill="currentColor"
      ) {{ mix.hue.toFixed(0) }}&deg;
    g#l-range.cursor-pointer
      rect#light(
        x="100"
        y="0"
        width="10"
        height="100"
        fill="url(#light)"
        ref="lightControl"
      )
      g.pointer-events-none(
        :transform="`translate(0,${100 - mix.light})`"
      )
        line(
          x1="100"
          x2="110"
          stroke="currentColor"
          stroke-linecap="round"
        )
        text(
          font-weight="bold"
          font-size="3px"
          x="105"
          y="-3"
          fill="currentColor"
        ) L {{ mix.light.toFixed(1) }}
    g#s-range.cursor-pointer
      rect#sat(
        x="-10"
        y="0"
        width="10"
        height="100"
        fill="url(#sat)"
        ref="satControl"
      )
      g.pointer-events-none(
        :transform="`translate(0,${100 - mix.sat})`"
      )
        line(
          x1="-10"
          x2="0"
          stroke="currentColor"
          stroke-linecap="round"
        )
        text(
          fill="currentColor"
          font-weight="bold"
          font-size="3px"
          x="-5"
          y="-3"
        ) {{ paramNames[mix.space][1] }} {{ mix.sat.toFixed(1) }}
  .flex.flex-wrap.items-center.justify-center(:style="{ color: mix.info.dark ? '#FFF' : '#000' }")
    button.p-1.capitalize.border-2.shadow-md.m-2.rounded-lg.border-dark-300(
      style="flex: 1 1 180px"
      v-for="(angles, harm) in harmonies" :key="harm"
      :class="{ active: harm == mix.harmony }"
      :style="{ backgroundColor: mix.info.dark ? '#333e' : '#eeee' }"
      @click="mix.harmony = harm"

      ) 
      .p-0 {{ harm }}
      .flex.flex-wrap.justify-center.gap-1
        .p-4.flex-1.rounded.text-sm.font-mono.uppercase(
          v-for="(step) in harmonies[harm]" :key="step" 
          :style="{ backgroundColor: generateTone(mix.hue + step).toHex() }"
        ) {{ generateTone(mix.hue + step).toHex() }}
</template>

<style lang="postcss" scoped>
button.active {
  @apply shadow-sm border-light-300;
}
</style>