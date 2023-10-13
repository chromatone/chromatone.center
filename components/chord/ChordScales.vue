<script setup>
import { chordList, scaleList, notes } from '#/use/theory'
import { globalScale } from '#/use/chroma'
import { rotateArray } from '#/use/calculations'
import { noteColor } from '#/use/colors'
import { computed } from 'vue';

const scaleChords = computed(() => scaleList
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
  return chordList.filter(chord => checkChord(chroma, chord.chroma))
}

// function countDegrees(chroma = '101010010100') {
//   return chroma.split('').reduce((curr, prev) => Number(prev) + Number(curr))
// }

const currentScale = computed(() => scaleChords.value.find(sc => sc.chroma == globalScale.chroma))

</script>

<template lang="pug">
.p-4.bg-dark-50.bg-opacity-20.m-2.flex.flex-col.gap-2
  .flex.flex-wrap.gap-2
    .flex.flex-col.rounded-2xl.border-2.gap-2.relative.max-h-60.overflow-y-scroll.overflow-x-hidden.overscroll-none.max-w-80(
      style="scroll-snap-type: y proximity;flex: 1 1 200px"
      v-for="degree in currentScale.degrees" 
      :key="degree"
      :style="{ borderColor: noteColor((degree + globalScale.tonic) % 12,2) }"
      ) 
      .z-10.sticky.top-0.font-bold.px-2.rounded-xl.flex.items-center.text-black(
        :style="{ backgroundColor: noteColor((degree + globalScale.tonic) % 12,2) }"
      ) {{ notes[(degree + globalScale.tonic) % 12] }}
        .flex-1
        .text-sm {{ degree }}

      .p-0.text-sm.flex.flex-col.justify-center(
        style="scroll-snap-align: center;"
        v-for="chord in currentScale.degreeChords[degree]" 
        :key="chord")
        chroma-keys(
          :playAll="true"
          :letters="false"
          :chroma="chord.chroma", 
          :pitch="(degree + globalScale.tonic) % 12")

</template>

