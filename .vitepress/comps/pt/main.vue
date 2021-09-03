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
.dim {
  @apply opacity-20;
}
</style>
  