<script setup>
import { Note, Interval, Pcset } from '@tonaljs/tonal'
import { freqColor, freqPitch, rotateArray } from '#/use/calculations'
import { noteColor } from '#/use/colors'
import { colord } from 'colord'
import { globalScale } from '#/use/chroma'
import { chordType, scaleType, notes } from '#/use/theory'

const props = defineProps({
  instrument: { type: String, default: 'ukulele' },
  chroma: { type: String, default: '100000000000' },
  pitch: { type: Number, default: 0 },
  chordNotes: { type: Array, default: [] }
});

// const instruments = {
//   guitar: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
//   ukulele: ['G4', 'C4', 'E4', 'A4']
// };

const instruments = {
  guitar: [7, 0, 5, 10, 2, 7],
  ukulele: [10, 3, 7, 0],
};

const inlays = [3, 5, 7, 10, 12, 15, 17, 19, 21]

const neck = reactive({
  strings: computed(() => instruments[props.instrument]),
  height: computed(() => (neck.strings.length - 1) * neck.noteSize),
  width: computed(() => neck.fretNum * neck.fretWidth),
  isInChord: computed(() => Pcset.isNoteIncludedIn(props.chordNotes)),
  chroma: computed(() => rotateArray(props.chroma.split(''), -props.pitch)),
  scale: computed(() => rotateArray(globalScale.chroma.split(''), -props.pitch)),
  title: computed(() => {
    if (!chordType.get(props.chroma)?.empty) return chordType.get(props.chroma).aliases[0]
    if (!scaleType.get(props.chroma)?.empty) return scaleType.get(props.chroma)
    else return ''
  }),
  noteSize: 50,
  fretWidth: 50,
  fretNum: 5,
});

function isInChord(note) {
  return Math.random() - 0.5 > 0 ? true : false
}

function semitoneColor(note, semitones) {
  return colord(freqColor(Note.freq(Note.transpose(note, Interval.fromSemitones(semitones))))).toHex()
}

function getNote(string, semitones) {
  return Note.transpose(string, Interval.fromSemitones(semitones))
}
</script>

<template lang="pug">
.flex.flex-col.items-center.justify-center.rounded-3xl.m-2.py-2(
  :style="{ backgroundColor: noteColor(pitch, 3, 1, 0.3) }"
)
  .flex.justify-center
    .text-2x.font-bold {{ notes[pitch] }}{{ neck.title }}
  svg#fretboard.max-h-3xl.w-full.my-2(
    version="1.1",
    baseProfile="full",
    :viewBox="`-50 -50 ${neck.height + 100} ${neck.width + 60}`",
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
        x1="0"
        :x2="neck.height"
      )
      g.fret(v-for="fret in neck.fretNum" :key="fret")
        line(
          :x1="neck.height"
          :y1="fret * neck.fretWidth"
          :y2="fret * neck.fretWidth"
          stroke="currentColor"
          stroke-width="2"
          opacity="0.5"
          )
        circle.inlay(
          v-if="inlays.find(fr => fr == fret)"
          :cy="(fret - 0.5) * neck.fretWidth"
          :cx="neck.height / 2"
          r="5"
          opacity="0.8"
          fill="currentColor"
        )
    g#strings
      g.string(
        v-for="(string, s) in neck.strings" 
        :key="string"
        :transform="`translate(${s * neck.noteSize} 0)`"
        )
        line(
          :y2="neck.width"
          stroke-width="4"
          stroke="currentColor"
          opacity="0.5"
        )
        g.note(
          v-for="(note, n) in neck.fretNum + 1" :key="note"
          :transform="`translate(0 ${(n - 0.5) * neck.fretWidth})`"
        )
          circle(
            :opacity="neck.chroma[(n + string) % 12] == 1 ? 1 : 0"
            :r="neck.noteSize / 2 - 8"
            :fill="semitoneColor(n + string)"
          )
          text(
            opacity="0"
            fill="white"
            font-size="18"
            font-weight="bold"
          ) {{ notes[(n + string) % 12] }}
</template>

<style lang="postcss" scoped>
.note {
  @apply cursor-pointer transition-all duration-300 ease-in-out;
}

.note text {
  @apply transition-all ease-in-out duration-100;
}

.note:hover text {
  opacity: 1;
}
</style>