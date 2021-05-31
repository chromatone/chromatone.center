<template lang="pug">
.flex.flex-wrap.my-4
  .note(
    v-for="note in notes", 
    :key="note.pitch"
    @click="tonic = note.pitch"
    :style="{ backgroundColor: tonic == note.pitch ? pitchColor(note.pitch) : 'hsla(0,0%,50%,0.5)' }"
    ) {{ note.name }}
.scales
  .p-2.flex-1.cursor-pointer.whitespace-nowrap(
    v-for="sc in scales"
    :key="sc.handle"
    @click="scale = sc"
    :style="{ fontWeight: scale.handle == sc.handle ? 'bold' : 'normal' }"
    ) {{ sc.name }}
tonal-array(:tonic="tonic", :scale="scale")
</template>

<script setup>
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { pitchColor, pitchFreq, notes, scales } from 'chromatone-theory'

const tonic = useStorage('tonic', 0);
const scale = ref(scales.minor);
</script>

<style scoped>
.note {
  @apply p-2 m-1 flex-1 rounded-full text-center cursor-pointer;
}

.scales {
  @apply flex overflow-x-scroll py-2 my-4;
}
</style>