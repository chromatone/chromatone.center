<script setup>
import { globalScale, activeNotes, noteColor, rotateArray } from '#/use';

const props = defineProps({
  pressed: { type: Boolean, default: false },
  octave: { type: Number, default: 0 },
  octaves: { type: Number, default: 4 },
  startOctave: { type: Number, default: 1 },
  size: { type: Number, default: 50 },
  n: { type: Number, default: 0 },
  note: { type: String, default: '' },
})
</script>

<template lang='pug'>
g.sector 
  SvgRing(
    :cx="0"
    :cy="0"
    :radius="size - octave * (size / octaves)"
    :thickness="size / octaves"
    :from="n * 30 - 15"
    :to="(n + 1) * 30 - 15"
    :fill="noteColor(n, octave + startOctave, rotateArray(globalScale.chroma, -globalScale.tonic)[n] == 1 ? 1 : 0.1, activeNotes[(n + ((octave + startOctave + 2) * 12) + 9)] ? 1 : 0.6)"
    ) 
    text.fill-black.text-4px(
      :style="{ fontWeight: rotateArray(globalScale.chroma, -globalScale.tonic)[n] == 1 ? 'bold' : 'normal', fontSize: globalScale.tonic == n ? '8px' : '4px' }"
      y="1" v-if="octave == 0") {{ note }}
</template>