<script setup>
import { chordList, scaleList, notes } from '@use/theory'
import { globalScale } from '@use/chroma'
import { pitchColor, rotateArray } from '@use/calculations'

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
  }).filter(sc => countDegrees(sc.chroma) < 9 ? true : false)
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

console.log(JSON.stringify(scaleChords.value))


</script>

<template lang='pug'>
.flex.flex-col
  .bg-dark-100.bg-opacity-20.p-3.m-3 
  .p-4.bg-dark-50.bg-opacity-20.m-2.flex.flex-col.gap-2
    .flex-col.flex.flex-1.gap-2
      .flex.flex-col.gap-2(v-for="scale in scaleChords" :key="scale") 
        .font-bold {{ scale.name }}
        .flex.gap-2
          .flex-1.bg-dark-50.bg-opacity-20.text-center.p-2.transition.cursor-pointer(
            v-for="(step, i) in scale.chroma.split('')" :key="i"
            :style="{ backgroundColor: step == 1 ? pitchColor(i + globalScale.tonic) : '#3333' }"
            @click="globalScale.tonic = (i + globalScale.tonic) % 12"
            ) {{ step == 1 ? notes[(i + globalScale.tonic) % 12] : '' }}
        .flex.gap-2
          .text-center.flex.flex-col.items-center.flex-1(
            v-for="degree in scale.degrees" :key="degree"
              :style="{ backgroundColor: pitchColor((degree + globalScale.tonic) % 12) }"
            ) 
            .font-bold {{ notes[(degree + globalScale.tonic) % 12] }}
            .p-0.text-sm.flex(v-for="chord in scale.degreeChords[degree]" :key="chord") {{ chord.aliases[0] }}

</template>

