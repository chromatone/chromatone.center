<template lang="pug">
.flex.flex-col.w-full.flex-auto
  client-only
    choose-scale.mb-4
    pt-control-row
    .flex.flex-col
      pt-shift(:top="true")
      .flex(v-for="octave in state.octave.list", :key="octave")
        pt-cell(:class="{ dim: !globalScale.isIn(note.name) }" v-for="note in notes", :key="note.name", :note="note", :octave="octave") 
      pt-shift

</template>
  
<script setup>
import { notes } from 'chromatone-theory'
import { state } from './state.js'
import { globalScale } from '@use/theory.js'

</script>
  
<style  scoped>
.scroll-bar {
  @apply bg-gray-200 dark:bg-gray-500;
  background-image: linear-gradient(
    0deg,
    transparent 80%,
    hsla(0, 0%, 0%, 0.2) 20%
  );
  background-blend-mode: multiply;
  background-size: 20px 4px;
}

.dim {
  @apply opacity-20;
}
</style>
  