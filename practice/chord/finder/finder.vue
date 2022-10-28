<script setup>
import finderKeys from './keys.vue'

import { noteColor } from "#use/colors"
import { notes, chords } from '#use/theory'

const accord = reactive({
  root: 0,
  info: chords.min,
});

const chordList = computed(() => {
  let list = Object.values(chords)
  return list.sort(compareChords)
});


function compareChords(a, b) {
  if (a.semitones.length < b.semitones.length) {
    return -1;
  }
  if (a.semitones.length > b.semitones.length) {
    return 1;
  }
  for (let i of [1, 2, 3]) {
    if (a.semitones[i] < b.semitones[i]) {
      return -1;
    }
    if (a.semitones[i] > b.semitones[i]) {
      return 1;
    }
  }
  return 0;
}

</script>

<template lang="pug">
.flex.flex-col
  .flex.flex-wrap.my-4.justify-center
    .chord(
      v-for="chord in chordList", 
      :key="chord?.handle", 
      @click="accord.info = chord",
      :class="{ active: chord?.handle == accord.info.handle }") {{ chord?.handle }}
  .text-6xl.my-4.text-center.font-bold(
    :style="{ color: noteColor(accord.root) }"
  ) {{ notes[accord?.root] }}{{ accord?.info.handle }}
  .relative.m-auto
    finder-keys#chord-keys(:accord="accord", @selectRoot="accord.root = $event")
</template>

<style lang="postcss" scoped>
.chord {
  @apply text-xl p-2 transition-all cursor-pointer m-1 rounded-lg border bg-light-100 dark_bg-dark-100 hover_bg-light-500 dark_(hover_bg-dark-300);

  &.active {
    @apply bg-light-700 dark_bg-dark-700;
  }
}
</style>