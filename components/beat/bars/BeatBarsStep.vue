<script setup>
import { levelColor } from "#/use/colors"
import { colord } from 'colord'

import { useData } from 'vitepress'
const { isDark } = useData()
import { tempo } from '#/use/tempo'
import { computed, watch } from "vue";
import { useClamp } from "@vueuse/math";

const props = defineProps({
  proportion: {
    type: Number,
    default: 1
  },
  step: {
    type: Number,
    default: 1
  },
  subdivisions: {
    type: [Array, String],
    default: ''
  },
  muted: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    default: 4
  },
  current: {
    type: [Number, String],
    default: 0
  },
  mutes: {
    type: Object,
    default: {}
  },
  accented: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 900
  },
  pad: {
    type: Number,
    default: 50
  }
});


const emit = defineEmits(['mute', 'subdivide', 'accent'])

const color = computed(() => levelColor(props.step + (tempo.pitch / 12) * props.total, props.total, 1))
const accent = computed(() => props.subdivisions[0].includes('!'))

const division = useClamp(0, 40, 640)
const divNum = computed(() => Math.floor(division.value / 40))

watch(divNum, (next, prev) => {
  if (next == prev) return
  let steps = []
  for (let d = 0; d < next; d++) {
    steps.push(`${props.step}-${d}`)
  }
  emit('subdivide', steps)
})

function dragDiv(drag) {
  if (drag.tap) {
    let sub = drag.event.currentTarget.dataset.sub
    props.mutes[sub] = !props.mutes[sub]
  }
  division.value += drag.delta[0] - drag.delta[1]
}

const active = computed(() => {
  let isParent = props.subdivisions[0] == props.current
  let p = props.subdivisions[0].split('-')[0]
  let c = props.current.split('-')[0]
  let isMuted = props.mutes[props.subdivisions[0]]
  return !isMuted && (isParent || p == c)
});
</script>


<template lang="pug">
g.cursor-pointer(
  :transform="`translate(${proportion * step * width + pad},0)`"

)
  g.step(:opacity="muted ? 0.1 : 1")
    rect.transition-fill.duration-100(
      @mousedown="$emit('mute')"
      :width="proportion * width"
      height="180"
      rx="10"
      :fill="active ? muted ? 'transparent' : color : 'transparent'"
    )
    circle.transition-all.duration-100.ease-out(
      @mousedown="muted ? $emit('mute') : $emit('accent')"
      cy="35"
      cx="0"
      r="25"
      stroke-width="4"
      :stroke="color"
      :fill="active ? muted ? 'transparent' : 'currentColor' : accented ? color : isDark ? '#333' : '#eee'"
    )
    text.pointer-events-none.transition-all.duration-100.ease-out(
      y="48"
      font-size="40"
      text-anchor="middle"
      x="0"
      :fill="active ? isDark ? '#333' : '#eee' : 'currentColor'"
    ) {{ step + 1 }}
    line.pointer-events-none(
      y1="60"
      y2="100"
      stroke-width="8"
      :stroke="color"
    )

    g.sub(
      v-for="(sub, s) in subdivisions" :key="sub"
      @dblclick="$emit('subdivide', [`${sub}-1`]); division = 40"
      :data-sub="sub"
      v-drag="dragDiv"
    )
      line(
        :transform="`translate(${s * proportion * width / subdivisions.length}, 0)`"
        y1="100"
        y2="150"
        stroke-width="1"
        stroke="currentColor"
      )
      rect.transition-fill.duration-100(
        :width="proportion * width / subdivisions.length"
        height="80"
        y="100"
        rx="10"
        :x="s * proportion * width / subdivisions.length"
        :fill="`hsla(0,0%,${90 - s * 80 / subdivisions.length}%,${sub == current ? 0.9 : 0.4})`"
      )
      circle.transition-all.duration-100.ease-out.pointer-events-none(
        :transform="`translate(${s * proportion * width / subdivisions.length}, 0)`"
        :cx="0"
        :cy="100"
        :r="6"
        :fill ="sub == current ? 'currentColor' : muted ? 'transparent' : color"
        :opacity="mutes[sub] ? 0 : 1"
        stroke-width="4"
        stroke-linecap="round"
        )
      text(
        v-if="!mutes[sub]"
        y="140"
        font-size="40"
        text-anchor="middle"
        :x="15 + s * proportion * width / subdivisions.length"
        fill="currentColor"
      ) {{ s + 1 }}
    circle.transition-all.duration-100.ease-out.pointer-events-none(
      cx="0"
      :cy="100"
      r="10"
      :fill="color"
      :stroke="active ? 'currentColor' : 'transparent'"
      stroke-width="4"
      opacity="0.8"
      )
  circle.transition-all.duration-100.ease-out.pointer-events-none(
    :cx="0"
    v-if="muted"
    :cy="100"
    r="3"
    fill="currentColor"
    opacity="0.8"
    )
</template>
