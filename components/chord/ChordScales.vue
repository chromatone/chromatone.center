<script setup>
import { notes, intervals } from '#/use/theory'
import { ChordType, ScaleType } from 'tonal'
import { globalScale } from '#/use/chroma'
import { rotateArray } from '#/use/calculations'
import { chromaColorMix, noteColor } from '#/use/colors'
import { computed } from 'vue';
import { useData } from 'vitepress'
const { isDark } = useData()

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

// function countDegrees(chroma = '101010010100') {
//   return chroma.split('').reduce((curr, prev) => Number(prev) + Number(curr))
// }

const currentScale = computed(() => scaleChords.value.find(sc => sc.chroma == globalScale.chroma))

</script>

<template lang="pug">
.flex.gap-1
  .flex.flex-col.border-2.gap-1.relative.max-h-120.overflow-y-scroll.overflow-x-hidden.overscroll-none.rounded(
    style="flex: 1 1 200px"
    v-for="degree in currentScale?.degrees" 
    :key="degree"
    :style="{ borderColor: noteColor((degree + globalScale.tonic) % 12, 2) }"
    ) 
    .z-10.sticky.top-0.font-bold.px-2.flex.items-center {{ notes[(degree + globalScale.tonic) % 12] }}
      .flex-1
      .text-sm {{ intervals[degree] }}

    button.p-1.text-sm.flex.flex-col.justify-center(
      style="scroll-snap-align: center;"
      v-for="chord in currentScale.degreeChords[degree]" 
      @click="emit('chord', { chroma: chord.chroma, degree })"
      :style="{ backgroundColor: chromaColorMix(chord.chroma, (degree + globalScale.tonic) % 12, 0.2, isDark ? 4 : 14).lch }"
      :key="chord") {{ notes[(degree + globalScale.tonic) % 12] }}{{ chord.aliases[0] }}

      //- chroma-keys(

      //-   :playAll="true"
      //-   :letters="false"
      //-   :chroma="chord.chroma", 
      //-   :pitch="(degree + globalScale.tonic) % 12")

</template>
