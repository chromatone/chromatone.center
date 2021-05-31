<template lang="pug">
.flex.flex-wrap.my-4
  .note(
    v-for="note in notes", 
    :key="note.pitch"
    @click="tonic = note.pitch"
    :style="{ backgroundColor: tonic == note.pitch ? pitchColor(note.pitch) : 'hsla(0,0%,50%,0.5)' }"
    ) {{ note.name }}
tonal-array(:tonic="tonic")
</template>

<script setup>
import { useStorage } from '@vueuse/core'
import { pitchColor, pitchFreq, notes } from 'chromatone-theory'

const tonic = useStorage('tonic', 0);
</script>

<style scoped>
.note {
  @apply p-2 m-1 flex-1 rounded-full text-center cursor-pointer;
}
</style>