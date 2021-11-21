<script setup>
const props = defineProps({
  chroma: { type: String, default: '100000000000' },
  pitch: { type: Number, default: 0 },
  scale: { type: String },
  roman: { type: String, default: '' },
});

const emit = defineEmits(['update:pitch'])

import { globalScale, playChroma, stopChroma } from '@use/chroma'
import { pitchColor, notes, rotateArray } from 'chromatone-theory'
import { chordType, scaleType } from '@use/theory'

const keys = reactive({
  white: [3, 5, 7, 8, 10, 0, 2],
  black: [4, 6, null, 9, 11, 1],
  pressed: false,
  chroma: computed(() => rotateArray(props.chroma.split(''), -props.pitch)),
  scale: computed(() => rotateArray(globalScale.chroma.split(''), -props.pitch)),
  title: computed(() => {
    if (!chordType.get(props.chroma)?.empty) return chordType.get(props.chroma).aliases[0]
    if (!scaleType.get(props.chroma)?.empty) return scaleType.get(props.chroma)
    else return ''
  })
});

function isInChroma(note) {
  return note != null && keys.chroma[note] == '1'
}

function isInScale(note) {
  return props.scale && note != null && rotateArray(props.scale.split(''), -props.pitch)[note] == '1'
}

function keyColor(key) {
  if (key == null) return 'transparent'
  return isInChroma(key) ? pitchColor(key, 5) : notes[key].pos == 0 ? '#eee' : '#aaa'
}

</script>

<template lang="pug">
.flex.flex-col.m-1.rounded-2xl.cursor-pointer.transition-all.duration-300.ease.relative(
  @mousedown="playChroma(chroma, pitch); keys.pressed = true"
  @touchstart.prevent.stop="playChroma(chroma, pitch); keys.pressed = true"
  @touchend="stopChroma(chroma, pitch); keys.pressed = false"
  @touchcancel="stopChroma(chroma, pitch); keys.pressed = false"
  @mouseup="stopChroma(chroma, pitch); keys.pressed = false"
  @mouseleave="stopChroma(chroma, pitch); keys.pressed = false"
  :style="{ backgroundColor: pitchColor(pitch, 2, 1, 0.5) }"
)
  .flex.justify-center.my-2.px-2
    .absolute.right-4 {{ roman }}
    .font-bold.text-xl.flex-1.text-center {{ notes[pitch].name }}{{ keys.title }}

  svg.w-full.mt-2(
    version="1.1",
    baseProfile="full",
    :viewBox="`-10 -10 720 320`",
    xmlns="http://www.w3.org/2000/svg",
    font-family="Commissioner, sans-serif"
    font-weight="bold"
    font-size="40"
    text-anchor="middle",
    dominant-baseline="middle"
    )
    defs
      filter#shadowButton(x="-50%" height="200%" width="300%")
        feDropShadow(dx="0" dy="3" stdDeviation="4" flood-color="#2225")
    g.white
      g.key(
        v-for="(key,k) in keys.white" :key="key"
        :transform="`translate(${k * 100 + 5} 0)`"
        @click="$emit('update:pitch', key)"
      )
        rect.transition-all.duration-300.ease-out(
          width="90"
          height="300"
          rx="45"
          :fill="keyColor(key)"
          style="filter:url(#shadowButton);"
          stroke-width="8"
          :stroke="isInScale(key) ? pitchColor(key, 3) : 'transparent'"
        )
        text(
          y="250"
          x="45"
          fill="black"
        ) {{ notes[key].name }}
    g.black 
      g.key(
        v-for="(key,k) in keys.black" :key="key"
        :transform="`translate(${k * 100 + 55} 10)`"
        @click="$emit('update:pitch', key)"
      )
        rect.transition-all.duration-300.ease-out(
          v-if="key"
          width="90"
          height="200"
          rx="45"
          style="filter:url(#shadowButton);"
          :fill="keyColor(key)"
          stroke-width="8"
          :stroke="isInScale(key) ? pitchColor(key, 3) : 'transparent'"
        )
        text.transition-all.duration-300.ease-out(
          y="130"
          x="40"
          fill="white"
        ) {{ notes[key]?.name }}
</template>

<style scoped>
.key text {
  opacity: 0;
  transition: all 300ms ease;
}
.key:hover text {
  opacity: 1;
}
</style>
