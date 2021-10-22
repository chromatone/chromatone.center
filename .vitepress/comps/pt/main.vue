<template lang="pug">
.flex.flex-col.w-full.flex-auto
  client-only
    control-scale.mb-4
    .flex.flex-wrap.p-4
      pt-switch(
        label="letters",
        :state="state.show.letters",
        @click="state.show.letters = !state.show.letters"
      )
      pt-switch(
        label="FREQ",
        :state="state.show.hz",
        @click="state.show.hz = !state.show.hz"
      )
      pt-switch(
        label="Length",
        :state="state.show.len",
        @click="state.show.len = !state.show.len"
      )
      pt-switch(
        label="BPM",
        :state="state.show.bpm",
        @click="state.show.bpm = !state.show.bpm"
      )
      .flex.border-1.px-2.rounded-lg.items-center
        .p-1.pr-2.font-bold A
        input.mx-1.p-2.max-w-16(type="number" v-model="state.middleA")
        .p-1 Hz
      transition(name="fade")
        pt-switch(
          v-if="!state.stopped"
          label="STOP",
          :state="state.stopped",
          @click="state.stopped = !state.stopped"
        )
      .flex-1
      full-screen(:el="table")
    .fullscreen-container(ref="table")
      pt-shift(:top="true")
      .flex.w-full(v-for="octave in state.octave.list", :key="octave")
        pt-cell(:class="{ dim: !globalScale.isIn(note.name) }" v-for="note in notes", :key="note.name", :note="note", :octave="octave") 
      pt-shift

</template>
  
<script setup>
import { notes } from 'chromatone-theory'
import { state } from './state.js'
import { globalScale } from '@use/theory.js'
import { onKeyStroke } from '@vueuse/core'

onKeyStroke(' ', (e) => {
  e.preventDefault()
  state.stopped = !state.stopped
})

const table = ref();

</script>
  
<style  scoped>
.dim {
  @apply opacity-20;
}
</style>
  