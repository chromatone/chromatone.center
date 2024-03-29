<script setup>
import { Note, Interval, Pcset } from '@tonaljs/tonal'
import { freqColor } from '#/use/calculations'
import { colord } from 'colord'
import { globalScale } from '#/use/chroma'
import { computed, reactive } from 'vue';
import { midi } from '#/use/midi';
import { useData } from 'vitepress';

const { isDark } = useData()
const props = defineProps({
  instrument: {
    type: String,
    default: 'ukulele'
  },
  chordNotes: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['note'])

const instruments = {
  guitar: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  ukulele: ['G4', 'C4', 'E4', 'A4']
};

const inlays = [3, 5, 7, 10, 12, 15, 17, 19, 21]

const neck = reactive({
  strings: computed(() => instruments[props.instrument]),
  height: computed(() => (neck.strings.length - 1) * neck.noteSize),
  width: computed(() => neck.fretNum * neck.fretWidth),
  isInChord: computed(() => Pcset.isNoteIncludedIn(props.chordNotes)),
  noteSize: 36,
  fretWidth: 50,
  fretNum: 12,
});

function noteColor(note, semitones) {
  const theNote = Note.transpose(note, Interval.fromSemitones(semitones))
  return colord(freqColor(Note.freq(theNote))).toHex()
}

function getNote(string, semitones) {
  return Note.transpose(string, Interval.fromSemitones(semitones))
}
</script>

<template lang="pug">
.flex.flex-col
  svg#fretboard.max-h-3xl.w-full(
    version="1.1",
    baseProfile="full",
    :viewBox="`-50 -30 ${neck.width + 100} ${neck.height + 60}`",
    xmlns="http://www.w3.org/2000/svg",
    font-family="Commissioner, sans-serif"
    font-size="20px"
    text-anchor="middle",
    dominant-baseline="middle"
    )
    g#fretboard
      line(
        stroke="currentColor"
        stroke-width="10"
        y1="0"
        :y2="neck.height"
      )
      g.fret(
        v-for="(fret,f) in neck.fretNum" 
        :key="fret")
        line(
          :y1="neck.height"
          :x1="fret * neck.fretWidth"
          :x2="fret * neck.fretWidth"
          stroke="currentColor"
          stroke-width="2"
          opacity="0.5"
          )
        text(
          :x="fret * neck.fretWidth - 6"
          :y="-15"
          font-size="0.7em"
          fill="currentColor"
          opacity="0.5"
        ) {{ fret }}
        circle.inlay(
          v-if="inlays.find(fr => fr == fret)"
          :cx="(fret - 0.5) * neck.fretWidth"
          :cy="neck.height / 2"
          r="5"
          opacity="0.8"
          fill="currentColor"
        )
    g#strings
      g.string(
        v-for="(string, s) in neck.strings" 
        :key="string"
        :transform="`translate(0,${neck.height - s * neck.noteSize})`"
        )
        line(
          :x2="neck.width"
          stroke-width="4"
          stroke="currentColor"
          opacity="0.5"
        )
        g.note(
          v-for="(note, n) in neck.fretNum + 1" 
          :key="note"
          :transform="`translate(${(n - 0.5) * neck.fretWidth},0)`"
          @click="$emit('note',getNote(string,n))"
        )
          circle(
            :opacity="globalScale.isIn(getNote(string, n)) ? 1 : 0"
            :stroke="neck.isInChord(getNote(string, n)) ? 'currentColor' : 'none'"
            stroke-width="3"
            :r="neck.isInChord(getNote(string, n)) ? neck.noteSize /1.7 - 4 : neck.noteSize / 2 - 8"
            :fill="noteColor(string, n)"
          )
          circle(
            :fill="isDark ? 'white' : 'black'"
            :opacity="midi.activeNotes[Note.midi(Note.transpose(string, Interval.fromSemitones(n)))] ? 1: 0"
            :r="neck.isInChord(getNote(string, n)) ? neck.noteSize /1.7 - 4 : neck.noteSize / 2 - 14"
          )
          text(
            opacity="0"
            fill="white"
            font-size="14"
            font-weight="bold"
          ) {{ getNote(string, n) }}
</template>

<style lang="postcss" scoped>
.note {
  @apply cursor-pointer;
}

.note text {
  @apply transition-all ease-in-out duration-100;
}

.note:hover text {
  opacity: 1;
}
</style>