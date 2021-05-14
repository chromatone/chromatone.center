<template lang="pug">
.flex.flex-col
  pt-shift(:top="true")
  .flex(v-for="octave in state.octave.list", :key="octave")
    pt-cell(v-for="note in notes", :key="note.name", :note="note", :octave="octave") 
  pt-shift
</template>

<script setup>
import { notes } from 'chromatone-theory'
import { state } from './state.js'

</script>

<style  scoped>
</style>