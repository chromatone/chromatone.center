<script setup>
import { chordList, scaleList, notes } from '#use/theory'
import { globalScale } from '#use/chroma'
import { pitchColor, rotateArray } from '#use/calculations'

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

function countDegrees(chroma = '101010010100') {
  return chroma.split('').reduce((curr, prev) => Number(prev) + Number(curr))
}

const currentScale = computed(() => scaleChords.value.find(sc => sc.chroma == globalScale.chroma))

</script>

<template lang='pug'>
.flex.flex-col
  .bg-dark-100.bg-opacity-20.p-3.m-3
    control-scale.flex-1.mb-4
  .p-4.bg-dark-50.bg-opacity-20.m-2.flex.flex-col.gap-2
    .flex-col.flex.flex-1.gap-2
      .flex.flex-wrap.gap-2.overflow-x-scroll.max-w-full
        .flex.flex-col.flex-1.rounded-2xl.border-2.gap-2.relative(
          v-for="degree in currentScale.degrees" :key="degree"
            :style="{ borderColor: pitchColor((degree + globalScale.tonic) % 12) }"
          ) 
          .font-bold.px-2.rounded-xl.flex.items-center(
            :style="{ backgroundColor: pitchColor((degree + globalScale.tonic) % 12) }"
          ) {{ notes[(degree + globalScale.tonic) % 12] }}
            .flex-1
            .text-sm {{ degree }}
          .flex.flex-wrap.gap-2.justify-center
            .p-0.text-sm.flex.flex-wrap.justify-center(v-for="chord in currentScale.degreeChords[degree]" :key="chord")
              chroma-keys.w-24(:chroma="chord.chroma", :pitch="(degree + globalScale.tonic) % 12")

</template>

