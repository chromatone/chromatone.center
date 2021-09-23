<template lang="pug">
.flex.flex-wrap.max-w-55ch.mx-auto.text-center.my-16.border-2(
  :style="{ borderColor: chromaColorMix(chroma, globalScale.tonic).hsl }"
)
  abc-render(v-if="abc" :abc="abc")
  chroma-circle.flex-1.min-w-200px.pl-4(:chroma="chroma")
  .flex.flex-col.items-center.justify-center.p-4.flex-1
    .w-full.text-2xl.font-bold.capitalize.my-4(
      v-if="title || chord.name || chord.aliases[0] || scale"
      ) {{ notes[globalScale.tonic].name }} {{ chord.name || chord.aliases[0] || scale }}
    chroma-piano.h-5rem(:chroma="chroma")
    .flex.flex-wrap.my-4
      .mx-1.flex.text-center(v-for="(interval,i) in chord.intervals") 
        .py-1 {{ interval }}
        .py-1(v-if="i !== chord.intervals.length - 1")
          la-plus
  chroma-row(:chroma="chroma")
  chroma-waveform(
    :chroma="chroma" 
    )
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
  }
});
import { notes } from 'chromatone-theory'
import { chromaColorMix } from "@use/colors.js";
import { playChroma, chordType, scaleType, stopChroma, globalScale } from '@use/theory.js'

const chord = computed(() => chordType.get(props.chroma));
const scale = computed(() => scaleType.get(props.chroma).name)
</script>

<style scoped>
</style>