<script setup>
import { pitchColor, pitchFreq, getCircleCoord } from '#use/calculations'
import { synthAttack, synthRelease } from '#use/synth.js'

import { colord } from 'colord'
const props = defineProps({
  R: Number,
  w: Number,
  note: Object,
  inner: {
    type: Number,
    default: 150,
  },
  level: {
    type: Number,
    default: 3
  }
});

const color = computed(() => {
  return colord(pitchColor(props.note.pitch, props.level)).toHex()
})

const active = ref(false)

function toggle() {
  active.value = !active.value
  if (active.value) {
    synthAttack(pitchFreq(props.note.pitch))
  } else {
    synthRelease(pitchFreq(props.note.pitch))
  }

}

const coord = computed(() => {
  return getCircleCoord(props.note.pitch, 12, props.R, props.w);
});

const innerCoord = computed(() => {
  return getCircleCoord(props.note.pitch, 12, props.inner, props.w);
});
</script>

<template lang="pug">
g.tet(
  style="cursor:pointer; transition: all 200ms ease-in-out"
  @click="toggle()"
  :opacity="active ? 1 : 0.75"
)
  line(
    :stroke="color"
    :stroke-width="2"
    :x1="coord.x"
    :y1="coord.y"
    :x2="innerCoord.x"
    :y2="innerCoord.y"
  )
  circle.note(
    style="transform-box: fill-box; transform-origin: center center;"
    :cx="coord.x",
    :cy="coord.y",
    r="36",
    :fill="color",
  )
  circle.note(
    style="transform-box: fill-box; transform-origin: center center;"
    :cx="innerCoord.x",
    :cy="innerCoord.y",
    r="4",
    :fill="color",
  )
  text(
    style="user-select:none;transition:all 300ms ease"
    fill="white"
    font-family="Commissioner, sans-serif"
    font-size="26px"
    font-weight="bold"
    text-anchor="middle",
    dominant-baseline="middle"
    :x="coord.x",
    :y="coord.y",
    v-html="note.name"
  )
  text(
    style="user-select:none;transition:all 300ms ease"
    fill="currentColor"
    font-family="Commissioner, sans-serif"
    font-size="15px"
    font-weight="normal"
    text-anchor="middle",
    dominant-baseline="middle"
    :x="coord.x",
    :y="coord.y + 22",
  )  {{ (note.pitch * 100).toFixed() }}
</template>

<style lang="postcss" scoped>
</style>