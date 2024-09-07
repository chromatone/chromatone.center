<script setup>

import { onKeyDown, onKeyUp, useStorage } from '@vueuse/core'
import { rotateArray, getCircleCoord } from '#/use/calculations'
import { notes } from '#/use/theory'
import { noteColor } from '#/use/colors'
import { Chord, Note, Range, Midi } from 'tonal'
import { playNote, stopNote } from '#/use/chroma'
import { reactive, computed } from 'vue'
import { midi, guessChords } from '#/use/midi'
import { colord } from 'colord'

onKeyDown('Shift', (ev) => {
  state.seventh = !state.seventh
})
onKeyUp('Shift', ev => {
  state.seventh = !state.seventh
})
onKeyDown('Alt', (ev) => {
  state.main = !state.main
})
onKeyUp('Alt', ev => {
  state.main = !state.main
})

const numFifths = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]
const allNotes = notes.map((n, i) => ({ name: n, pitch: i }))
const minors = numFifths.map(n => allNotes[n]);
const majors = rotateArray(numFifths, -3).map(n => allNotes[n]);

const scales = { minor: minors, major: majors }

const tonic = useStorage('tonic', 0)
const scaleType = useStorage('scale-type', 'major')

const state = reactive({
  seventh: false,
  main: true,
  pressed: false,
})

const steps = {
  minor: [['VI', 'III', 'VII'], ['iv', 'i', 'v']],
  major: [['IV', 'I', 'V'], ['ii', 'vi', 'iii']]
}

const chordShapes = {
  minor: [0, 3, 7, 12],
  major: [0, 4, 7, 12],
  minor7: [0, 3, 7, 10],
  major7: [0, 4, 7, 11]
}


function getRadius(qual) {
  return qual == 'minor' ? 1 : 0;
}

function getChordType(qual) {
  return qual == 'minor' ? state.seventh ? 'm7' : 'm' : state.seventh ? 'M7' : ''
}

function getChordNotes(note, qual = "major", inv) {
  const type = getChordType(qual)
  const chord = Chord.get(note + type)

  if (inv !== undefined) {
    const result = Range.numeric([1 + inv, 4 + inv]).map(Chord.degrees(type || 'major', note + `3`));
    return result
  } else {
    return Note.names(chord.notes.map(n => Note.simplify(n) + 4))
  }

}

function playChord(note, qual = 'major', inv) {
  playNote(getChordNotes(note, qual, inv))
}

function stopChord(note, qual = 'major', inv) {
  stopNote(getChordNotes(note, qual, inv))
}

</script>

<template lang="pug">
.fullscreen-container#screen.select-none.touch-manipulation.h-full.max-h-screen
  pre.text-xs.fixed.top-0.right-0 {{ midi.offset }}
  svg#fifths.w-full(
    style="flex: 1 1 auto; touch-action:none;user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;"
    version="1.1",
    baseProfile="full",
    viewBox="0 0 100 100",
    xmlns="http://www.w3.org/2000/svg",
    font-family="Commissioner, sans-serif"

    )
    g(
      fill="currentColor"
      transform="translate(50,50)"
      font-size="3px"
      text-anchor="middle",
      dominant-baseline="middle"
      font-weight="bold"
      )
      text {{ guessChords[0] }}
    g.cursor-pointer(
      transform="translate(10,90)"
      @click="state.seventh = !state.seventh"
      v-tooltip.top="'Hold SHIFT to toggle 7th chords'"
      )
      text(
        fill="currentColor"
        font-size="3px"
        text-anchor="middle",
        dominant-baseline="middle"
        y="0.3"
        :font-weight="state.seventh ? 'bold' : 'normal'"
        ) 7
      circle(
        r="3"
        fill="transparent"
        stroke="currentColor"
        :stroke-width="state.seventh ? 0.8 : 0.4"
        )
    g.cursor-pointer(
      transform="translate(90,90)"
      @click="state.main = !state.main"
      v-tooltip.top="'Hold ALT to toggle chord inversions'"
      )
      text(
        fill="currentColor"
        font-size="3px"
        text-anchor="middle",
        dominant-baseline="middle"
        y="0.3"
        :font-weight="state.main ? 'bold' : 'normal'"
        ) A
      circle(
        r="3"
        fill="transparent"
        stroke="currentColor"
        :stroke-width="state.main ? 0.8 : 0.4"
        )
    g.rings(

      )
      g.ring(
        v-for="(scale, qual) in scales"
        :key="qual"
        )
        g.around(
          v-for="(note, i) in scale", 
          :key="i",
          style="cursor:pointer"
          )
          svg-ring(
            :cx="50"
            :cy="50"
            :from="(i - 1) / 12 * 360 + 15"
            :to="(i) / 12 * 360 + 15"
            :radius="40 - 12 * getRadius(qual)"
            :thickness="10"
            :op="Math.abs(tonic - i) == 11 || Math.abs(tonic - i) % 12 <= 1 ? 0.8 : 0.1"
            :fill="Math.abs(tonic - i) == 11 || Math.abs(tonic - i) % 12 <= 1 ? noteColor(note.pitch) : noteColor(note.pitch, 2, 1)"
            )
          g.quadro(
            @mouseenter="state.pressed && playChord(note.name, qual, j)"
            @mousedown.stop.prevent="state.pressed = true; playChord(note.name, qual, j)", 
            @touchstart.stop.prevent="state.pressed = true; playChord(note.name, qual, j)", 
            @mouseleave="stopChord(note.name, qual, j)", 
            @mouseup="state.pressed = false; stopChord(note.name, qual, j)", 
            @touchend="state.pressed = false; stopChord(note.name, qual, j)", 
            @touchcancel="state.pressed = false; stopChord(note.name, qual, j)"
            v-for="(deg, j) in chordShapes[qual + (state.seventh ? '7' : '')]"
            :key="j"
            )
            svg-ring.transition(
              :cx="50"
              :cy="50"
              :from="(i - 1) / 12 * 360 + 15 + 15 * (j % 2)"
              :to="(i) / 12 * 360 + 15 * (j % 2)"
              :radius="40 - 12 * getRadius(qual) - 5 * (j > 1 ? 0 : 1)"
              :thickness="5"
              :op="Math.abs(tonic - i) == 11 || Math.abs(tonic - i) % 12 <= 1 ? midi.activeChroma[(note.pitch + deg) % 12] == 1 ? .7 : .3 : midi.activeChroma[(note.pitch + deg) % 12] == 1 ? .2 : 0.1"
              :fill="Math.abs(tonic - i) == 11 || Math.abs(tonic - i) % 12 <= 1 ? noteColor(note.pitch + deg, 5) : noteColor(note.pitch + deg, 5, 1)"
              )
          circle.transition(
            :cx="getCircleCoord(i, 12, 42 - getRadius(qual) * 26).x",
            :cy="getCircleCoord(i, 12, 42 - getRadius(qual) * 26).y",
            :r="2"
            :fill="noteColor(note.pitch, 4, 1, 1)"
            class="opacity-20 hover-opacity-80"
            @click="tonic = i; scaleType = qual"
            )
          g(
            v-if="state.main"
            @mousedown="playChord(note.name, qual)", 
            @touchstart="playChord(note.name, qual)", 
            @mouseleave="stopChord(note.name, qual)", 
            @mouseenter="state.pressed && playChord(note.name, qual)"
            @mouseup="stopChord(note.name, qual)", 
            @touchend="stopChord(note.name, qual)", 
            @touchcancel="stopChord(note.name, qual)"
            )
            circle.note.opacity-80.hover-opacity-100(
              style="transition: all 300ms ease-out;transform-box: fill-box; transform-origin: center center;"
              :cx="getCircleCoord(i, 12, 35 - getRadius(qual) * 12).x",
              :cy="getCircleCoord(i, 12, 35 - getRadius(qual) * 12).y",
              r="5",
              :fill="Math.abs(tonic - i) == 11 || Math.abs(tonic - i) % 12 <= 1 ? noteColor(note.pitch, 4) : noteColor(note.pitch, 5, 1, 0.5)",
            )
          text.pointer-events-none(
            style="user-select:none;transition:all 300ms ease"
            :fill="colord(noteColor(note.pitch, 4)).isDark() ? 'white' : 'white'"
            font-size="3px"
            text-anchor="middle",
            dominant-baseline="middle"
            :x="getCircleCoord(i, 12, 35 - getRadius(qual) * 12).x",
            :y="getCircleCoord(i, 12, 35 - getRadius(qual) * 12).y + 0.5",
          ) {{ note.name }}{{ getChordType(qual) }}

    g.transition-all.duration-300.ease-out(
      ref="selector"
      transform-origin="50 50"
      :style="{ transform: `rotate(${tonic / 12 * 360}deg)` }"
      )
      svg-ring(
        :cx="50"
        :cy="50"
        :from="(-2) / 12 * 360 + 15"
        :to="(+ 1) / 12 * 360 + 15"
        :radius="44.5"
        :thickness="31"
        :sWidth=".5"
        stroke="#fff3"
        fill="none"
        )
      circle.transition-all.duration-300.cursor-pointer(
        v-if="scaleType != 'minor'"
        :cx="50"
        :cy="8"
        :r="2"
        :fill="noteColor(majors[tonic].pitch, 4)"
      )
      circle.transition-all.duration-300.cursor-pointer(
        v-if="scaleType != 'major'"
        :cx="50"
        :cy="34"
        :r="2"
        :fill="noteColor(minors[tonic].pitch, 4)"
      )
      g(
        v-for="(level, idx) in steps[scaleType]" 
        :key="idx")
        text.pointer-events-none(
          v-for="(step, n) in level"
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

<style lang="postcss" scoped>
g.active path,
path:hover {
  @apply opacity-100
}
</style>