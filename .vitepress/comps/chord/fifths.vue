<template lang="pug">
svg.max-h-3xl.w-full(
  id="fifths"
  version="1.1",
  baseProfile="full",
  viewBox="0 0 100 100",
  xmlns="http://www.w3.org/2000/svg",
  )
  g(
    v-for="(scale,min) in [majors, minors]"
    :key="scale"
  )
    g.around(
      style="mix-blend-mode: screen;cursor:pointer"
      v-for="(note,i) in scale", 
      :key="i",
      @mousedown="playChord(note.name, min)", 
      @touchstart="playChord(note.name, min)", 
      @mouseleave="stopChord(note.name, min)", 
      @mouseup="stopChord(note.name, min)", 
      @touchend="stopChord(note.name, min)", 
      @touchcancel="stopChord(note.name, min)"
    )
      svg-ring(
        :cx="50"
        :cy="50"
        :from="(i - 1) / 12 * 360 + 15"
        :to="(i) / 12 * 360 + 15"
        :radius="40 - 12 * min"
        :thickness="10"
        :opacity="Math.abs(tonic - i) == 11 || Math.abs(tonic - i) % 12 <= 1 ? 0.6 : 0.2"
        :fill="Math.abs(tonic - i) == 11 || Math.abs(tonic - i) % 12 <= 1 ? pitchColor(note.pitch) : pitchColor(note.pitch, 4, 1)"
      )
      circle(
        :cx="getCircleCoord(i, 12, 42 - min * 26).x",
        :cy="getCircleCoord(i, 12, 42 - min * 26).y",
        :r="2"
        :fill="pitchColor(note.pitch, 4, 1, 1)"
        @click="tonic = i"
        opacity="0.2"
        class="hover:opacity-60 transition-all duration-300"
      )
      circle.note(
        style="transition: all 300ms ease-out;transform-box: fill-box; transform-origin: center center;"
        :cx="getCircleCoord(i, 12, 35 - min * 12).x",
        :cy="getCircleCoord(i, 12, 35 - min * 12).y",
        r="5",
        :fill="Math.abs(tonic - i) == 11 || Math.abs(tonic - i) % 12 <= 1 ? pitchColor(note.pitch) : pitchColor(note.pitch, 4, 1, 0.1)",
      )
      text(
        style="user-select:none;transition:all 300ms ease"
        fill="white"
        font-family="Commissioner, sans-serif"
        font-size="4px"
        text-anchor="middle",
        dominant-baseline="middle"
        :x="getCircleCoord(i, 12, 35 - min * 12).x",
        :y="getCircleCoord(i, 12, 35 - min * 12).y + 0.5",
      ) {{ note.name }}{{ min == 1 ? 'm' : '' }}

  g(
    ref="selector"
    transform-origin="50 50"
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
    circle(
      :cx="50"
      :cy="8"
      :r="2"
      :fill="pitchColor(majors[tonic].pitch)"
    )
    circle(
      :cx="50"
      :cy="34"
      :r="2"
      :fill="pitchColor(minors[tonic].pitch)"
    )
svg-save(
  svg="fifths"
  :file="`circle-of-fifths-${tonic}.svg`"
)
</template>

<script setup>
import { defineProps, ref, watch } from 'vue'
import { useMotion } from '@vueuse/motion'
import { useStorage } from '@vueuse/core'
import { notes, rotateArray, getCircleCoord, pitchColor } from 'chromatone-theory'
import { Chord, Note } from '@tonaljs/tonal'
import { synthAttack, synthRelease } from '@use/synth.js'
import { midiAttack, midiRelease } from '@use/midi.js'

const numFifths = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]
const minors = numFifths.map(n => notes[n]);
const majors = rotateArray(numFifths, -3).map(n => notes[n]);

const tonic = useStorage('tonic', 0)
const selector = ref(null);

const move = useMotion(selector);

watch(tonic, pos => {
  move.apply({
    rotate: pos / 12 * 360,
    transition: {
      type: 'spring',
      damping: 20,
    }
  });
}, { immediate: true });


function playChord(note, min = 0) {
  let type = min == 1 ? 'm' : ''
  let chord = Chord.get(note + type)
  let nts = Note.names(chord.notes.map(n => Note.simplify(n) + 4))
  synthAttack(nts)
  midiAttack(nts)
};

function stopChord(note, min = 0) {
  let type = min == 1 ? 'm' : ''
  let chord = Chord.get(note + type)
  let nts = chord.notes.map(n => Note.simplify(n) + 4)
  synthRelease(nts)
  midiRelease(nts)
};


</script>

<style scoped>
</style>