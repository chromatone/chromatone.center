<template lang="pug">
.flex.flex-col(
  @mousedown="playChroma(chroma, pitch); pressed = true"
    @touchstart.prevent.stop="playChroma(chroma, pitch); pressed = true"
    @touchend="stopChroma(chroma, pitch); pressed = false"
    @touchcancel="stopChroma(chroma, pitch); pressed = false"
    @mouseup="stopChroma(chroma, pitch); pressed = false"
    @mouseleave="stopChroma(chroma, pitch); pressed = false"
)
  .py-6px.px.px-8.w-full.text-sm.text-center.font-bold.cursor-pointer.rounded(
    v-for="(step,n) in rotateArray(chroma, -pitch).reverse()"
      :key="n"
      :style="{ backgroundColor: step == 1 ? pitchColor(11 - n) : minor[11 - n] == 1 ? 'hsla(0,0%,90%,0.3)' : 'hsla(0,0%,40%,0.3)' }"
    ) 
</template>

<script setup>
const props = defineProps({
  pitch: { type: Number, default: 0 },
  chroma: { type: String, default: '1001000100101' },
  mode: { type: String, default: 'O' },
  tonic: { type: Number, default: 0 },
  roman: { type: String, default: '' },
});

import { pitchColor, rotateArray } from 'chromatone-theory'
import { globalScale, noteNames, notes, playChroma, stopChroma } from '@use/theory.js'
import { Progression, Chord } from "@tonaljs/tonal";

const minor = '101101011010'.split('')

</script>

<style scoped>
</style>