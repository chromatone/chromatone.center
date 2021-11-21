<template lang="pug">
.fullscreen-container#screen
  full-screen.absolute.top-2.right-2
  svg#fifths.h-full.max-h-80vh.w-full(
    style="flex: 1 1 600px;touch-action:none"
    version="1.1",
    baseProfile="full",
    viewBox="0 0 100 100",
    xmlns="http://www.w3.org/2000/svg",
    font-family="Commissioner, sans-serif"
    )
    g(
      v-for="(scale,qual) in scales"
      :key="qual"
    )
      g.around(
        style="cursor:pointer"
        v-for="(note,i) in scale", 
        :key="i",
        @mousedown="playChord(note.name, qual)", 
        @touchstart="playChord(note.name, qual)", 
        @mouseleave="stopChord(note.name, qual)", 
        @mouseup="stopChord(note.name, qual)", 
        @touchend="stopChord(note.name, qual)", 
        @touchcancel="stopChord(note.name, qual)"
      )
        svg-ring(
          :cx="50"
          :cy="50"
          :from="(i - 1) / 12 * 360 + 15"
          :to="(i) / 12 * 360 + 15"
          :radius="40 - 12 * getRadius(qual)"
          :thickness="10"
          :op="Math.abs(tonic - i) == 11 || Math.abs(tonic - i) % 12 <= 1 ? 0.8 : 0.1"
          :fill="Math.abs(tonic - i) == 11 || Math.abs(tonic - i) % 12 <= 1 ? pitchColor(note.pitch) : pitchColor(note.pitch, 4, 1)"
        )
        circle(
          :cx="getCircleCoord(i, 12, 42 - getRadius(qual) * 26).x",
          :cy="getCircleCoord(i, 12, 42 - getRadius(qual) * 26).y",
          :r="2"
          :fill="pitchColor(note.pitch, 4, 1, 1)"
          @click="tonic = i; scaleType = qual"
          class="opacity-20 hover:opacity-80"
        )
        circle.note(
          style="transition: all 300ms ease-out;transform-box: fill-box; transform-origin: center center;"
          :cx="getCircleCoord(i, 12, 35 - getRadius(qual) * 12).x",
          :cy="getCircleCoord(i, 12, 35 - getRadius(qual) * 12).y",
          r="5",
          :fill="Math.abs(tonic - i) == 11 || Math.abs(tonic - i) % 12 <= 1 ? pitchColor(note.pitch) : pitchColor(note.pitch, 4, 1, 0.5)",
        )
        text(
          style="user-select:none;transition:all 300ms ease"
          fill="currentColor"
          font-size="4px"
          text-anchor="middle",
          dominant-baseline="middle"
          :x="getCircleCoord(i, 12, 35 - getRadius(qual) * 12).x",
          :y="getCircleCoord(i, 12, 35 - getRadius(qual) * 12).y + 0.5",
        ) {{ note.name }}{{ qual == 'minor' ? 'm' : '' }}

    g.transition-all.duration-300.ease-out(
      ref="selector"
      transform-origin="50 50"
      :style="{ transform: `rotate(${tonic / 12 * 360}deg)`}"
    )
      svg-ring(
        :cx="50"
        :cy="50"
        :from="(-2) / 12 * 360 + 15"
        :to="(+ 1) / 12 * 360 + 15"
        :radius="44.5"
        :thickness="31"
        stroke-width="0.5"
        stroke="gray"
        fill="none"
      )
      circle.transition-all.duration-300.cursor-pointer(
        :cx="50"
        :cy="8"
        :r="2"
        v-if="scaleType != 'minor'"
        :fill="pitchColor(majors[tonic].pitch)"
      )
      circle.transition-all.duration-300.cursor-pointer(
        :cx="50"
        :cy="34"
        :r="2"
        v-if="scaleType != 'major'"
        :fill="pitchColor(minors[tonic].pitch)"
      )
      g(v-for="(level,idx) in steps[scaleType]" :key="idx")
        text.pointer-events-none(
          v-for="(step,n) in level"
          :key="step"
          style="user-select:none;transition:all 300ms ease;"
          fill="currentColor"
          font-size="2.5px"
          text-anchor="middle",
          dominant-baseline="middle"
          :x="getCircleCoord(n - 1, 12, 42 - idx * 26).x",
          :y="getCircleCoord(n - 1, 12, 42 - idx * 26).y + 0.25",
          :style="{ transform: `rotate(${-(tonic) * 30}deg)`, transformOrigin: `${getCircleCoord(n - 1, 12, 42 - idx * 26).x}px ${getCircleCoord(n - 1, 12, 42 - idx * 26).y}px` }"
        ) {{ step }}
</template>

<script setup>

import { useStorage } from '@vueuse/core'
import { notes, rotateArray, getCircleCoord, pitchColor } from 'chromatone-theory'
import { Chord, Note } from '@tonaljs/tonal'
import {playNote, stopNote} from '@use/chroma'

const numFifths = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]
const minors = numFifths.map(n => notes[n]);
const majors = rotateArray(numFifths, -3).map(n => notes[n]);

const scales = { minor: minors, major: majors }

const tonic = useStorage('tonic', 0)
const scaleType = useStorage('scale-type', 'major')

const steps = {
  minor: [['VI', 'III', 'VII'], ['iv', 'i', 'v']],
  major: [['IV', 'I', 'V'], ['ii', 'vi', 'iii']]
}

function getRadius(qual) {
  return qual == 'minor' ? 1 : 0;
}

function playChord(note, qual = 'major') {
  let type = qual == 'minor' ? 'm' : ''
  let chord = Chord.get(note + type)
  let nts = Note.names(chord.notes.map(n => Note.simplify(n) + 4))
  playNote(nts)

};

function stopChord(note, qual = 'major') {
  let type = qual == 'minor' ? 'm' : ''
  let chord = Chord.get(note + type)
  let nts = chord.notes.map(n => Note.simplify(n) + 4)
  stopNote(nts)
};

</script>

<style scoped>
</style>