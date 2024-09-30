<script setup>
import { rotateArray } from '#/use/calculations'
import { notes } from '#/use/theory'
import { playChroma, stopChroma, playNoteOnce } from '#/use/chroma'
import { globalScale } from '#/use/global'
import { chromaColorMix, noteColor } from "#/use/colors"
import { Frequency } from 'tone'
import { colord } from 'colord'
import { computed } from 'vue'
import { ChordType, ScaleType } from 'tonal'


const props = defineProps({
  pitch: { type: Number, default: null },
  chroma: { type: String, default: '1001000100101' },
  mode: { type: String, default: 'O' },
  tonic: { type: Number, default: 0 },
  roman: { type: String, default: '' },
});


const minor = '101101011010'.split('')

const actualPitch = computed(() => {
  if (props.pitch === 0 || props.pitch) {
    return props.pitch
  } else {
    return globalScale.tonic
  }
})
const chord = computed(() => ChordType.get(props.chroma));
const scale = computed(() => ScaleType.get(props.chroma))

const steps = computed(() => {
  let arr = rotateArray(props.chroma.split(''), -actualPitch.value);
  return arr.map((step, s) => ({ active: step == '1', pitch: s })).reverse()
});

function hover(step) {
  if (step.active) {
    playNote(step.pitch)
  }
}

function playNote(note = 0, octave = 0) {
  let freq = Frequency(note + 57, 'midi')
  playNoteOnce(freq.toNote())
}
</script>

<template lang="pug">
.flex.flex-col.cursor-pointer.select-none.p-4.m-2.rounded-xl.transition-all.duration-300.ease.w-full(
  :style="{ backgroundColor: chromaColorMix(chroma, actualPitch).hsl }"
    @mousedown="playChroma(chroma, actualPitch); pressed = true"
    @touchstart.prevent.stop="playChroma(chroma, actualPitch); pressed = true"
    @touchend="stopChroma(chroma, actualPitch); pressed = false"
    @touchcancel="stopChroma(chroma, actualPitch); pressed = false"
    @mouseup="stopChroma(chroma, actualPitch); pressed = false"
    @mouseleave="stopChroma(chroma, actualPitch); pressed = false"
)
  .p-2.text-center.mb-2.rounded-lg.text-white(
    :style="{ backgroundColor: noteColor(actualPitch, 3), color: colord(noteColor(actualPitch), 3).isDark() ? 'white' : 'black' }"
    )
    .font-bold {{ pitch === false ? '' : typeof pitch == 'string' ? pitch : notes[actualPitch] }}{{ chord.aliases[0] }}
    .text-sm(v-if="props.roman") {{ props.roman }}
  .py-6px.px-8.my-2px.w-full.text-sm.text-center.font-bold.rounded.transition-all.duration-300.ease.touch-none(
    @mouseenter="hover(step)"
    @touchstart="hover(step)"
    v-for="(step, n) in steps"
    :key="n"
    :style="{ backgroundColor: step.active ? noteColor(step.pitch) : minor[step.pitch] == 1 ? 'hsla(0,0%,90%,0.8)' : 'hsla(0,0%,20%,0.6)' }"
    ) 
</template>

<style lang="postcss" scoped></style>