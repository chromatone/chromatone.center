<template lang="pug">
.profile(
  :style="{ borderColor: chromaColorMix(chroma, globalScale.tonic).hsl }"
)
  chroma-waveform(
    :chroma="chroma" 
    )
  .flex.flex-col.items-center.justify-center.p-4.w-full.relative
    a.p-2.absolute.top-8px.right-2em(
      v-if="link"
      :href="link"
      target="_blank"
    )
      la-wikipedia-w
    .text-2xl.font-bold.capitalize.mb-4(
      v-if="title || chord.name || chord.aliases[0] || scale"
      ) {{ notes[globalScale.tonic].name }} {{ chord.name || chord.aliases[0] || scale }}
    chroma-piano.h-5rem(:chroma="chroma")
    .flex.flex-wrap.my-4
      .mx-1.flex.text-center(v-for="(interval,i) in chord.intervals") 
        .py-1 {{ interval }}
        .py-1(v-if="i !== chord.intervals.length - 1")
          la-plus
  chroma-row(:chroma="chroma")
  chroma-circle.flex-1.min-w-200px.pl-4(:chroma="chroma")
  chroma-bars.flex-1.p-6(:chroma="chroma")
  abc-render(v-if="abc" :abc="abc")

  chroma-square.p-4(:chroma="chroma")


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
  }
});
import { notes } from 'chromatone-theory'
import { chromaColorMix } from "@use/colors.js";
import { playChroma, chordType, scaleType, stopChroma, globalScale } from '@use/theory.js'

const chord = computed(() => chordType.get(props.chroma));
const scale = computed(() => scaleType.get(props.chroma).name)
</script>

<style scoped>
.profile {
  @apply flex flex-wrap max-w-55ch mx-auto text-center border-2 rounded-xl shadow-lg bg-light-500 dark:bg-dark-500;
}
</style>