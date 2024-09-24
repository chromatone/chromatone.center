<script setup>
import { notes, intervals } from '#/use/theory'
import { ChordType, Interval, ScaleType } from 'tonal'
import { globalScale, playNote, stopNote } from '#/use/chroma'
import { rotateArray } from '#/use/calculations'
import { noteColor } from '#/use/colors'
import { computed, ref } from 'vue';

import ScaleChordsCard from './ScaleChordsCard.vue'
import { midi } from '#/use'

const emit = defineEmits(['chord'])

const scaleChords = computed(() => ScaleType.all()
  .map(scale => {
    const degrees = [0, ...scale.chroma.split('').map((step, s) => step == 1 ? s : false).filter(Boolean)]
    let degreeChords = {}
    degrees.forEach(degree => degreeChords[degree] = findChords(rotateArray(scale.chroma.split(''), degree).join('')))
    return {
      ...scale,
      degrees,
      degreeChords
    }
  })
)

function checkChord(scale = '101010010100', chord = '100010010000') {
  let scl = scale.split('')
  let chr = chord.split('')
  let chrLen = chr.reduce((curr, prev) => Number(prev) + Number(curr))
  if (chrLen < 3) return false
  for (let i = 0; i < 12; i++) {
    if (chr[i] == 1 && scl[i] != 1) {
      return false
    }
  }
  return true
}

function findChords(chroma = '101010010100') {
  return ChordType.all().filter(chord => checkChord(chroma, chord.chroma))
}

const currentScale = computed(() => scaleChords.value.find(sc => sc.chroma == globalScale.chroma))

const currentChord = ref()


</script>

<template lang="pug">
.gap-2.p-4.items-center.select-none(
  style="display: grid;  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));") 
  template(
    style="flex: 1"
    v-for="degree in currentScale?.degrees" 
    :key="degree") 
    .flex.items-center.gap-2.px-2
      .text-sm.w-4 {{ intervals[degree] }}
      .flex-1
      .font-bold.w-8.h-8.rounded-full.flex.items-center.flex-col.cursor-pointer.select-none(
        @pointerdown="playNote(degree + globalScale.tonic + 57 + midi.offset * 12)"
        @pointerup.stop.prevent="stopNote(degree + globalScale.tonic + 57 + midi.offset * 12)"
        @pointercancel="stopNote(degree + globalScale.tonic + 57 + midi.offset * 12)"
        @pointerout="stopNote(degree + globalScale.tonic + 57 + midi.offset * 12)"
        :style="{ backgroundColor: noteColor((degree + globalScale.tonic) % 12, 2) }") {{ notes[(degree + globalScale.tonic) % 12] }}
    ScaleChordsCard(
      @pointerdown="emit('chord', chord); currentChord = chord"
      v-for="chord in currentScale.degreeChords[degree].toSorted((a, b) => a.intervals.length > b.intervals.length ? 1 : -1)" 
      :key="chord"
      :chord
      :degree)
</template>

<style scoped lang="postcss">
button.active {
  @apply border-current
}
</style>