<template lang="pug">
.flex.flex-col.items-center.mb-4
  .flex
    .chroma-key(
      v-for="(bit,i) in set.chroma.split('')"
      :key="i"
      :style="{ backgroundColor: bit == 1 ? pitchColor(i) : 'hsla(0,0%,50%,0.3)' }"
      ) 
  .flex.flex-wrap.justify-center(v-if="!chord.empty || scale")
    .p-2(v-if="!chord.empty") 
      span  {{ chord.name }} 
      span  ({{ chord.aliases[0] }})
    .p-2(v-if="scale") @ {{ scale }} scale
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { ChordType, ScaleType } from '@tonaljs/tonal'
import { pitchColor } from 'chromatone-theory'
const props = defineProps({
  set: Object,
});

const chord = ChordType.get(props.set.chroma)
const scale = ScaleType.get(props.set.chroma).name
</script>

<style scoped>
.chroma-key {
  @apply p-2 mx-1 sm:(p-4 mx-2) rounded-full;
}
</style>