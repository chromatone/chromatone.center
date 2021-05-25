<template lang="pug">
.flex.flex-col.items-center.mb-8
  .flex
    .chroma-key(
      v-for="(bit,i) in set?.chroma.split('')"
      :key="i"
      :style="{ backgroundColor: bit == 1 ? pitchColor((Number(i) + tonic) % 12) : minor[(Number(i) + tonic) % 12] == '1' ? 'hsla(0,0%,80%,0.3)' : 'hsla(0,0%,20%,0.3)' }"
      ) 
  .flex.flex-wrap.justify-center.border-b-2.pt-2(v-if="!chord.empty || scale")
    .note  {{ notes[tonic].name }}
    .chord
      span {{ chord.aliases[0] }}  &nbsp;
      span.text-gray-500(class="dark:text-gray-400")  {{ chord.name }} 
    .scale(v-if="scale") @ {{ scale }} scale
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { ChordType, ScaleType } from '@tonaljs/tonal'
import { pitchColor, notes } from 'chromatone-theory'
const props = defineProps({
  set: Object,
  tonic: {
    type: Number,
    default: 0
  }
});
const minor = "101101011010"

const chord = ChordType.get(props.set.chroma)
const scale = ScaleType.get(props.set.chroma).name
</script>

<style lang="postcss" scoped>
.chroma-key {
  @apply transition-all duration-300 h-2em px-3 flex-1 mx-1px sm:(p-4 mx-1 rounded-lg) rounded-sm;
}
</style>