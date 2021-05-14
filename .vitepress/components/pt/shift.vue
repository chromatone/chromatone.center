<template lang="pug">
.flex.text-2xl.text-center.cursor-pointer
  .btn.bg-gray-300(class="dark:bg-gray-900",@click="decOctave(top)") &ndash;
  .btn.bg-gray-50(class="dark:bg-gray-500",@click="incOctave(top)") +
</template>

<script setup>
import { state } from './state.js'
import { defineProps } from 'vue'

const props = defineProps({
  top: Boolean,
})

function decOctave(top) {
  let pos = top ? 1 : 0;
  let other = top ? 0 : 1;

  if (top && state.octave.range[pos] <= state.octave.range[other]) return
  if (!top && state.octave.range[pos] <= state.octave.limit[pos]) return

  state.octave.range[pos]--
}

function incOctave(top) {
  let pos = top ? 1 : 0;
  let other = top ? 0 : 1;

  if (top && state.octave.range[pos] >= state.octave.limit[pos]) return
  if (!top && state.octave.range[pos] >= state.octave.range[other]) return

  state.octave.range[pos]++
}

</script>

<style scoped>
.btn {
  @apply flex-1 font-bold p-2 opacity-70 m-2 shadow rounded-lg hover:opacity-100 transition;
}
</style>