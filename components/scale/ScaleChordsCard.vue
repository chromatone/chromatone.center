<script setup>
import { notes } from '#/use/theory'
import { Interval, Chord, Note } from 'tonal'
import { globalScale } from '#/use/chroma'
import { midiColor } from '#/use/calculations'
import { chromaColorMix } from '#/use/colors'
import { useData } from 'vitepress'
import { midi, activeNotes, playNote, stopNote } from '#/use'
import { computed, ref } from 'vue'

const props = defineProps({
  chord: { type: Object, default: () => ({}) },
  degree: { type: Number, default: 0 }
})

const { isDark } = useData()

const chordMidi = computed(() => props.chord.intervals.map(int => (Interval.semitones(int) + props.degree + globalScale.tonic) + 69 - 12 + midi.offset * 12))

function getInversion(chord, degree, n, octave = 0) {
  return Array.from({ length: chord.intervals.length }, (_, i) => i + 1 + n).map(Chord.degrees(chord.aliases[0], notes[(degree + globalScale.tonic) % 12] + (4 + midi.offset - octave))).map(Note.midi)
}

const pressed = ref(false)

</script>

<template lang='pug'>
.flex.flex-col.border-1.p-1.border-op-10.dark-border-light-900.dark-border-op-10.border-dark-200.rounded.overflow-hidden.select-none.relative(
  :style="{ backgroundColor: chromaColorMix(chord.chroma, (degree + globalScale.tonic) % 12, 0.2, isDark ? 4 : 14).lch }"
  :class="{ active: chordMidi.filter(note => activeNotes[note]).length == chordMidi.length }") 
  .text-sm.absolute.top-2.left-2.w-full.z-100.pointer-events-none.text-white.font-bold {{ notes[(degree + globalScale.tonic) % 12] }}{{ chord.aliases[0] }}
  .flex.flex-1.w-full(v-for="oct in [0, 1]" :key="oct")
    button.relative.py-3.px-1.flex-1(
      v-for="(note, n) in chordMidi" 
      :key="note" 
      :style="{ backgroundColor: midiColor(note - oct * 12, activeNotes[note - oct * 12] ? 1 : .3) }"
      @pointerdown.prevent="pressed = true; playNote(getInversion(chord, degree, n, oct))"
      @pointerup="pressed = false; stopNote(getInversion(chord, degree, n, oct))"
      @pointerleave="stopNote(getInversion(chord, degree, n, oct))"
      @pointerout="stopNote(getInversion(chord, degree, n, oct))"
      @pointercancel="pressed = false; stopNote(getInversion(chord, degree, n, oct))"
      @pointerenter="pressed && playNote(getInversion(chord, degree, n, oct))"
      ) 
        span.text-10px.absolute.z-100.top-0.left-1.text-white.pointer-events-none(v-if="oct == 1") {{ notes[(note - 9) % 12] }}

</template>