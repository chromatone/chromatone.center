<template lang="pug">
.flex.flex-col
  .flex.flex-wrap.my-4.justify-center
    .chord(
      v-for="chord in chordList", 
      :key="chord?.handle", 
      @click="accord.info = chord",
      :class="{ active: chord?.handle == accord.info.handle }") {{ chord?.handle }}
  .text-6xl.my-4.text-center.font-bold(
    :style="{ color: pitchColor(accord.root) }"
  ) {{ notes[accord?.root].name }}{{ accord?.info.handle }}
  .relative.m-auto
    chord-tool-keys#chord-keys(:accord="accord", @selectRoot="accord.root = $event")
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { chords, notes, pitchColor } from 'chromatone-theory'

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

<style  scoped>
.chord {
  @apply text-xl p-2 transition-all cursor-pointer m-1 rounded-lg border bg-light-100 dark:bg-dark-100 hover:bg-light-500 dark:(hover:bg-dark-300);
  &.active {
    @apply bg-light-700 dark:bg-dark-700;
  }
}
</style>