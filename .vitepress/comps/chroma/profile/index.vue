<template lang="pug">
.profile(
  :style="{ borderColor: chromaColorMix(chroma, globalScale.tonic).hsl }"
)
  chroma-waveform(
    :chroma="chroma" 
    )
  abc-render(v-if="abc" :abc="abc")
  .flex.flex-col.items-center.justify-center.p-4.w-full.relative
    a.p-2.absolute.top-8px.right-2em(
      v-if="link"
      :href="link"
      target="_blank"
    )
      la-wikipedia-w
    .text-2xl.font-bold.capitalize.mb-2(
      ) {{ notes[globalScale.tonic].name }} {{ chord.name || chord.aliases[0] || scale.name }} {{ scale.aliases[0] ? `(${scale.aliases[0]})` : '' }}
  chroma-piano.h-5rem.mx-auto.mb-4(:chroma="chroma")  
  chroma-row.mb-4.mx-2(v-model:chroma="chroma")
  chroma-circle.flex-1.min-w-200px.pl-4(:chroma="chroma")
  chroma-stack.flex-1.mx-4(:chroma="chroma")
  chroma-square.w-12em.mx-4(:chroma="chroma")
  .flex.w-full.p-6(v-if="description") {{ description }}

</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: null
  },
  chroma: {
    type: String,
    default: '1001000100000'
  },
  abc: {
    type: String,
    default: null
  },
  link: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: ''
  }
});
import { Interval, Pcset } from '@tonaljs/tonal'
import { notes } from 'chromatone-theory'
import { chromaColorMix } from "@use/colors.js";
import { playChroma, chordType, scaleType, stopChroma, globalScale } from '@use/theory.js'

const info = reactive({
  chord: computed(() => chordType.get(props.chroma)),
  scale: computed(() => scaleType.get(props.chroma)),
})

const chord = computed(() => chordType.get(props.chroma));
const scale = computed(() => scaleType.get(props.chroma));
const intervals = computed(() => Pcset.intervals(props.chroma));
const semitones = computed(() => {
  let arr = []
  if (!intervals.value) return []
  for (let i = 1; i < intervals.value.length; i++) {
    arr[i - 1] = (Interval.semitones(intervals.value[i]) - Interval.semitones(intervals.value[i - 1]))
  }
  return arr
});
</script>

<style scoped>
.profile {
  @apply flex flex-wrap max-w-55ch mx-auto text-center border-2 rounded-xl shadow-lg bg-light-500 dark:bg-dark-500;
}
</style>