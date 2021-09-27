<template lang="pug">
.flex.flex-col.cursor-pointer.select-none(
  @mousedown="playChroma(chroma, actualPitch); pressed = true"
    @touchstart.prevent.stop="playChroma(chroma, actualPitch); pressed = true"
    @touchend="stopChroma(chroma, actualPitch); pressed = false"
    @touchcancel="stopChroma(chroma, actualPitch); pressed = false"
    @mouseup="stopChroma(chroma, actualPitch); pressed = false"
    @mouseleave="stopChroma(chroma, actualPitch); pressed = false"
)
  .p-2.text-center.font-bold.mb-2.rounded.border-3(
    :style="{ borderColor: pitchColor(globalScale.tonic), backgroundColor: chromaColorMix(chroma, actualPitch).hsl }"
  ) {{ pitch === false ? '' : typeof pitch == 'string' ? pitch : notes[actualPitch]?.name }}{{ chord.aliases[0] }}
  .py-6px.px-8.w-full.text-sm.text-center.font-bold.rounded(
    v-for="(step,n) in rotateArray(chroma, -actualPitch).reverse()"
      :key="n"
      :style="{ backgroundColor: step == 1 ? pitchColor(11 - n) : minor[11 - n] == 1 ? 'hsla(0,0%,90%,0.3)' : 'hsla(0,0%,40%,0.3)' }"
    ) 
</template>

<script setup>
const props = defineProps({
  pitch: { type: Number, default: null },
  chroma: { type: String, default: '1001000100101' },
  mode: { type: String, default: 'O' },
  tonic: { type: Number, default: 0 },
  roman: { type: String, default: '' },
});

import { pitchColor, rotateArray } from 'chromatone-theory'
import { globalScale, noteNames, notes, chordType, scaleType, playChroma, stopChroma } from '@use/theory.js'
import { chromaColorMix } from "@use/colors.js"
import { Progression, Chord } from "@tonaljs/tonal"

const minor = '101101011010'.split('')

const actualPitch = computed(() => {
  if (props.pitch === 0 || props.pitch) {
    return props.pitch
  } else {
    return globalScale.tonic
  }
})
const chord = computed(() => chordType.get(props.chroma));
const scale = computed(() => scaleType.get(props.chroma).name)

</script>

<style scoped>
</style>