<template lang="pug">
.flex.flex-wrap.max-w-55ch.mx-auto
  abc-render(v-if="abc" :abc="abc")
  chroma-circle(:chroma="chroma")
  chroma-row(:chroma="chroma")
  .mx-auto.my-2
    span Intervals: 
    span.mx-2.font-bold(v-for="interval in chord.intervals") {{ interval }}
</template>

<script setup>
const props = defineProps({
  chroma: {
    type: String,
    default: '1001000100000'
  },
  abc: {
    type: String,
    default: null
  }
});

import { playChroma, chordType, scaleType, stopChroma, globalScale } from '@use/theory.js'

const chord = computed(() => chordType.get(props.chroma));
const scale = computed(() => scaleType.get(props.chroma).name)
</script>

<style scoped>
</style>