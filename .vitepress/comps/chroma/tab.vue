<template lang="pug">
.flex.flex-col.w-full
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
      g.fret(v-for="fret in neck.fretNum" :key="fret")
        line(
          :y1="neck.height"
          :x1="fret * neck.fretWidth"
          :x2="fret * neck.fretWidth"
          stroke="currentColor"
          stroke-width="2"
          opacity="0.5"
          )
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
        v-for="(string,s) in neck.strings" 
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
          v-for="(note,n) in neck.fretNum + 1" :key="note"
          :transform="`translate(${(n - 0.5) * neck.fretWidth},0)`"
        )
          circle(
            :opacity="globalScale.isIn(getNote(string, n)) ? 1 : 0.1"
            :stroke="isInChord(getNote(string, n)) ? 'currentColor' : 'none'"
            stroke-width="3"
            :r="isInChord(getNote(string, n)) ? neck.noteSize / 2 - 8 : neck.noteSize / 2 - 8"
            :fill="noteColor(string, n)"
          )
          text(
            opacity="0"
            fill="white"
            font-size="14"
            font-weight="bold"
          ) {{ getNote(string, n) }}
</template>

<script setup>
import { Note, Interval, Pcset } from '@tonaljs/tonal'
import { freqColor, freqPitch } from 'chromatone-theory'
import { colord } from 'colord'
import { globalScale } from '@use/theory.js'
const props = defineProps({
  instrument: {
    type: String,
    default: 'ukulele'
  },
  chroma: { type: String, default: '100100010010' },
  pitch: { type: Number, default: 0 },
  chordNotes: {
    type: Array,
    default: []
  }
});

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
  fretNum: 5,
});

function isInChord(note) {
  console.log(note)
  return Math.random() - 0.5 > 0 ? true : false
}

function noteColor(note, semitones) {
  return colord(freqColor(Note.freq(Note.transpose(note, Interval.fromSemitones(semitones))))).toHex()
}

function getNote(string, semitones) {
  return Note.transpose(string, Interval.fromSemitones(semitones))
}
</script>

<style scoped>
.note {
  @apply cursor-pointer;
  & text {
    @apply transition-all ease-in-out duration-100;
  }
  &:hover text {
    opacity: 1;
  }
}
</style>