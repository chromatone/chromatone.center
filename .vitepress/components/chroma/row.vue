<template lang="pug">
.flex.flex-col.items-stretch.mb-6.w-full
  .flex.flex-wrap.justify-center.border-b-1.pt-2.mb-2(v-if="!chord.empty || scale")
    .note  {{ notes[tonic].name }}
    .chord
      span {{ chord.aliases[0] }}  &nbsp;
      span.text-gray-500(class="dark:text-gray-400")  {{ chord.name }} 
    .scale(v-if="scale") @ {{ scale }} scale
  .grid.grid-cols-12.justify-items-stretch
    .chroma-key(
      @mouseenter="$emit('play')"
      @mouseleave="$emit('stop')"
      v-for="(bit,i) in set?.chroma.split('')"
      :key="i"
      :class="{ active: bit == 1 }"
      :style="{ backgroundColor: bit == 1 ? pitchColor((i + tonic) % 12) : minor[(i + tonic) % 12] == '1' ? 'hsla(0,0%,80%,0.3)' : 'hsla(0,0%,20%,0.3)' }"
      ) {{ bit == 1 ? notes[(i + tonic) % 12].name : i }}
</template>

<script setup>
import { defineProps, computed, defineEmit } from 'vue'
import { ChordType, ScaleType } from '@tonaljs/tonal'
import { pitchColor, notes } from 'chromatone-theory'
const props = defineProps({
  set: Object,
  tonic: {
    type: Number,
    default: 0
  }
});

const emit = defineEmit(['play', 'stop'])

const minor = "101101011010"

const chord = ChordType.get(props.set.chroma)
const scale = ScaleType.get(props.set.chroma).name
</script>

<style lang="postcss" scoped>
.chroma-key {
  @apply grid place-content-center text-xs transition-all duration-300 p-1 py-3  mx-4px sm:(py-4)  rounded-md;
}
.chroma-key.active {
  @apply text-light-100 font-bold;
}
</style>