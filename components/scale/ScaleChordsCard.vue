<script setup>
import { notes } from '#/use/theory'
import { Interval, Chord, Note } from 'tonal'
import { globalScale } from '#/use/chroma'
import { midiColor } from '#/use/calculations'
import { chromaColorMix } from '#/use/colors'
import { useData } from 'vitepress'
import { midi, activeNotes, playNote, stopNote } from '#/use'
import { computed } from 'vue'

const props = defineProps({
  chord: { type: Object, default: () => ({}) },
  degree: { type: Number, default: 0 }
})

const { isDark } = useData()

const chordMidi = computed(() => props.chord.intervals.map(int => (Interval.semitones(int) + props.degree + globalScale.tonic) + 69 - 12 + midi.offset * 12))

function getInversion(chord, degree, n) {
  return Array.from({ length: chord.intervals.length }, (_, i) => i + 1 + n).map(Chord.degrees(chord.aliases[0], notes[(degree + globalScale.tonic) % 12] + (4 + midi.offset))).map(Note.midi)
}

</script>

<template lang='pug'>
button.text-sm.flex.flex-col.border-1.border-op-10.dark-border-light-900.dark-border-op-10.border-dark-200.rounded.overflow-hidden(
  style="scroll-snap-align: center; flex: 0 0 90px"
  :style="{ backgroundColor: chromaColorMix(chord.chroma, (degree + globalScale.tonic) % 12, 0.2, isDark ? 4 : 14).lch }"
  :class="{ active: chordMidi.filter(note => activeNotes[note]).length == chordMidi.length }") 
  .p-1.text-start(  @pointerdown="playNote(chordMidi)"
  @pointerup="stopNote(chordMidi)"
  @pointerleave="stopNote(chordMidi)"
  @pointerout="stopNote(chordMidi)"
  @pointercancel="stopNote(chordMidi)") {{ notes[(degree + globalScale.tonic) % 12] }}{{ chord.aliases[0] }}
  .flex.flex-1.w-full 
    .py-2.px-1.flex-1(
      v-for="(note, n) in chordMidi" 
      :key="note" 
      :style="{ backgroundColor: midiColor(note, activeNotes[note] ? 1 : .3) }"
      @pointerdown="playNote(getInversion(chord, degree, n))"
      @pointerup="stopNote(getInversion(chord, degree, n))"
      @pointerleave="stopNote(getInversion(chord, degree, n))"
      @pointerout="stopNote(getInversion(chord, degree, n))"
      @pointercancel="stopNote(getInversion(chord, degree, n))"
      )
</template>