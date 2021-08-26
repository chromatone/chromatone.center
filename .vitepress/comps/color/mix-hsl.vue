<template lang="pug">
.flex.flex-col.items-center.mb-8.p-4
  .flex.flex-wrap
    sqnob(v-model="mix.hueCount" :min="2" :max="36" param="hue steps" :fixed="0")
    sqnob.w-5rem(v-model="mix.toneCount" :min="2" :max="8" :param="`${mix.ring} steps`" :fixed="0")
    choose(
      v-model="mix.space"
      :variants="{ hsl: 'hsl', lch: 'lch', hwb: 'hwb', }"
    )
    sqnob(v-model="mix.sat" :min="0" :max="100" :param="paramNames[mix.space][1]" :fixed="0")
    sqnob(v-model="mix.light" :min="0" :max="100" :param="paramNames[mix.space][2]" :fixed="0")
    choose(
      v-model="mix.ring"
      :variants="{ shades: 'shades', tones: 'tones', tints: 'tints' }"
    )
  svg.max-h-3xl.w-full(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 100 100",
    xmlns="http://www.w3.org/2000/svg",
    stroke-width="2px"
    font-family="Commissioner, sans-serif"
    style="touch-action: pinch-zoom;"
    )
    g.arc.cursor-pointer(
      v-for="(arc,i) in mix.hueArcs" :key="arc"
    )
      svg-ring.sector(
        v-for="(tone,t) in generateTones(arc.from)"
        :cx="50"
        :cy="50"
        :radius="45 - (25 / mix.toneCount) * t"
        :thickness="25 / mix.toneCount"
        :from="arc.from"
        :to="arc.to"
        :fill="tone.toHex()"
        :stroke="tone.toHex()"
        @click="mix.current = tone.toHex()"
        :class="{ current: mix.current == tone.toHex() }"
      )
    g#current
      circle(
        :fill="mix.current"
        cx="50"
        cy="50"
        r="18"
      )
      color-svg-info(:color="mix.current" :y="40")
</template>

<script setup>
import { colord } from 'colord'

const mix = reactive({
  current: useStorage('color-current', '#fffff'),
  space: useStorage('color-space', 'lch'),
  ring: useStorage('color-rings', 'tints'),
  hueCount: useStorage('hueCount', 12),
  toneCount: useStorage('toneCount', 6),
  hue: useStorage('hue', 50),
  sat: useStorage('saturation', 50),
  light: useStorage('lightness', 50),
  hsl: computed(() => `hsla(${mix.hue},${mix.sat}%,${mix.light}%,1)`),
  hueSteps: computed(() => {
    let steps = [...Array(mix.hueCount)]
    return steps.map((step, i) => {
      return 360 * i / mix.hueCount - 180 / mix.hueCount
    })
  }),
  hueArcs: computed(() => {
    let arcs = []
    mix.hueSteps.forEach((step, i, arr) => {
      let arc
      if (i == arr.length - 1) {
        arc = {
          from: step,
          to: arr[0]
        }
      } else {
        arc = {
          from: step,
          to: arr[i + 1],
        }
      }
      arcs.push(arc)
    })
    return arcs
  }),
});

const paramNames = {
  hsl: ['Hue', 'Saturation', 'Lightness'],
  lch: ['Hue', 'Chroma', 'Lightness'],
  hwb: ['Hue', 'Black', 'White',]
}

function generateTones(hue) {
  let tones
  if (mix.space == 'lch') {
    tones = colord(`lch(${mix.light}% ${mix.sat} ${hue} / 1)`)[mix.ring](mix.toneCount)
  } else if (mix.space ==
    'hsl') {
    tones = colord(`hsl(${hue}, ${mix.sat}%, ${mix.light}%)`)[mix.ring](mix.toneCount)
  } else {
    tones = colord({ h: hue, w: mix.light, b: mix.sat, a: 1 })[mix.ring](mix.toneCount)
  }
  return tones
}
</script>

<style scoped>
.sector {
  @apply transition-all ease-in-out duration-50;
  &:hover {
    @apply transform scale-105;
  }
  &.current {
    @apply transform scale-95;
  }
}
</style>