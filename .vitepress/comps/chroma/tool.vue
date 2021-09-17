<template lang="pug">
.flex.flex-col
  .relative.w-full.m-auto
    chroma-compass#chroma-compass(
      v-model:chroma="chroma"
      v-model:tonic="tonic"
      :scaleChroma="scaleChroma"
      @clearScale="clearScale()"
      )
  .max-w-65ch.m-auto
    piano-keys.w-xs.h-4em.m-auto(
      v-model:pitch="tonic" :chroma="chroma" names) 
    .flex.flex-wrap.m-auto

      .chord-group(
        v-for="(name,count) in groupNames", 
        :key="name"
        :class="{ active: count + 2 == numNotes }"
        @click="chroma = chordGroups[count][0].chroma"
        ) {{ name }}
    .flex.flex-col.items-center
      .flex.flex-wrap.my-4.justify-center
        .chord(
          :style="{ color: chord?.chroma == chroma ? 'white' : chromaColorMix(chord.chroma, tonic).hsl, backgroundColor: chord?.chroma == chroma ? chromaColorMix(chord.chroma, tonic).hsl : '' }"
          v-for="chord in chordGroup", 
          :key="chord?.aliases[0]", 
          @click="chroma = chord.chroma",
          :class="{ active: chord?.chroma == chroma }") {{ notes[tonic].name + chord?.aliases[0] }}

    .flex.flex-wrap
      .text-xl.flex-1.min-w-full.text-center.my-4
        .text-sm It may be the root chord in these scales:
      transition-group(name="list")
        .chord(
          v-for="name in chordScales",
          :style="{ color: scale == name ? 'white' : chromaColorMix(ScaleType.get(name).chroma, tonic).hsl, backgroundColor: scale == name ? chromaColorMix(ScaleType.get(name).chroma, tonic).hsl : '' }"
          :key="name"
          @click="scale = name"
          :class="{ active: scale == name }"
          ) {{ notes[tonic].name }} {{ name }}
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { chords, notes, pitchColor } from 'chromatone-theory'
import { chromaColorMix } from '@use/colors.js'
import { ChordType, Chord, ScaleType, Interval } from '@tonaljs/tonal'
import { chordList } from '@use/theory.js'
import { useStorage } from '@vueuse/core'

const tonic = useStorage('chroma-tonic', 0)
const chroma = useStorage('chroma-chroma', chordList[0].chroma)

const groupNames = ['Intervals', 'Triads', 'Tetrads', 'Pentads', 'Hexads', 'Heptads']

const chordGroups = computed(() => {
  let arr = []
  for (let i = 0; i < 6; i++) {
    arr[i] = chordList.filter(get => get.intervals.length === i + 2)
  }
  return arr
})

const chord = computed(() => {
  return ChordType.get(chroma.value)
})

const chordScales = computed(() => {
  return Chord.chordScales(chord.value.aliases[0]) || []
})

const scale = useStorage('scale', chordScales.value[0])
function clearScale() { scale.value = '' }
const scaleTonic = useStorage('scaleTonic', 0)

const scaleChroma = computed(() => {
  return ScaleType.get(scale.value).chroma
})

const numNotes = computed(() => {
  return chroma.value.split('').reduce((acc, val) => Number(acc) + Number(val))
})

const chordGroup = computed(() => {
  return chordList.filter(get => get.intervals.length === numNotes.value)
});


</script>

<style  scoped>
.chord {
  @apply p-1 transition-all cursor-pointer m-1 rounded-lg bg-light-100 dark:bg-dark-800 hover:bg-light-800 dark:(hover:bg-dark-300);
}

.chord.active {
  @apply bg-dark-100 text-light-300 hover:bg-dark-900 dark:(text-dark-600 bg-light-200 hover:(bg-light-900));
}

.chord-group {
  @apply cursor-pointer flex p-2 m-2 text-lg border-b-w-4 border-gray-500 transition-all box-content border-opacity-0;
}

.chord-group.active {
  @apply font-bold border-b-w-4 border-opacity-100;
}
</style>