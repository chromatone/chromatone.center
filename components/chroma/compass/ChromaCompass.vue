<script setup>
import { chromaColorMix } from '#/use/colors'
import { ChordType, Chord, ScaleType } from 'tonal'
import { notes } from '#/use/theory'
import { globalScale } from '#/use/chroma'
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'

const chroma = useStorage('chroma-chroma', ChordType.all()[0].chroma)

const groupNames = ['Intervals', 'Triads', 'Tetrads', 'Pentads', 'Hexads', 'Heptads']

const chordGroups = computed(() => {
  let arr = []
  for (let i = 0; i < 6; i++) {
    arr[i] = ChordType.all().filter(get => get.intervals.length === i + 2)
  }
  return arr
})

const chord = computed(() => {
  return ChordType.get(chroma.value)
})

// const chordScales = computed(() => {
//   return Chord.chordScales(chord.value.aliases[0]) || []
// })

// const scale = ref(chordScales.value[0])
// function clearScale() { scale.value = '' }

// const scaleChroma = computed(() => {
//   return ScaleType.get(scale.value).chroma
// })

const numNotes = computed(() => {
  return chroma.value.split('').reduce((acc, val) => Number(acc) + Number(val))
})

const chordGroup = computed(() => {
  return ChordType.all().filter(get => get.intervals.length === numNotes.value)
});
</script>

<template lang="pug">
#screen.fullscreen-container.rounded-3xl
  .relative.w-full.m-auto
    chroma-compass-circle#chroma-compass(
      v-model:chroma="chroma"
      :scale-chroma="scaleChroma"
      @clear-scale="clearScale()"
      )
  .max-w-60ch.m-auto.flex.flex-col.items-center
    chroma-keys.m-auto(
      v-model:pitch="globalScale.tonic"
      :chroma="chroma") 
    .flex.flex-col.p-2
      .flex.flex-wrap.mx-auto.justify-center
        .chord-group(
          v-for="(name, count) in groupNames", 
          :key="name"
          :class="{ active: count + 2 == numNotes }"
          @click="chroma = chordGroups[count][0].chroma"
          ) {{ name }}

      .flex.flex-wrap.justify-center
        .chord(
          v-for="ch in chordGroup"
          :key="ch?.aliases[0]", 
          :style="{ color: ch?.chroma == chroma ? 'white' : chromaColorMix(ch.chroma, globalScale.tonic).hsl, backgroundColor: ch?.chroma == chroma ? chromaColorMix(ch.chroma, globalScale.tonic).hsl : '' }", 
          :class="{ active: ch?.chroma == chroma }",
          @click="chroma = ch.chroma") {{ notes[globalScale.tonic] + ch?.aliases[0] }}

      //- .flex.flex-wrap.justify-center
        .min-w-full.text-center.my-4
          .mx-auto.w-auto.text-sm.border-b-1.border-current It may be the root chord in these scales:
        .chord(
          v-for="name in chordScales",
          :key="name"
          :style="{ color: scale == name ? 'white' : chromaColorMix(ScaleType.get(name).chroma, globalScale.tonic).hsl, backgroundColor: scale == name ? chromaColorMix(ScaleType.get(name).chroma, globalScale.tonic).hsl : '' }"
          :class="{ active: scale == name }"
          @click="scale = name"
          ) {{ notes[globalScale.tonic] }} {{ name }}
</template>

<style lang="postcss" scoped>
.chord {
  @apply p-1 transition-all cursor-pointer m-1 rounded-lg bg-light-100 dark-bg-dark-800 hover-bg-light-800 dark-(hover-bg-dark-300);
}

.chord.active {
  @apply bg-dark-100 text-light-300 hover-bg-dark-900 dark-(text-dark-600 bg-light-200 hover-(bg-light-900));
}

.chord-group {
  @apply cursor-pointer flex p-2 m-2 text-lg border-b-w-4 border-gray-500 transition-all box-content border-opacity-0;
}

.chord-group.active {
  @apply font-bold border-b-w-4 border-opacity-100;
}
</style>