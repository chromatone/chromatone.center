<script setup>
import tableShift from './shift.vue'
import tableCell from './cell.vue'
import tableSwitch from './switch.vue'

import { notes } from '#/use/theory'
import { state } from './state.js'
import { globalScale } from '#/use/chroma'
import { onKeyStroke } from '@vueuse/core'
import { ref } from 'vue'

onKeyStroke(' ', (e) => {
  e.preventDefault()
  state.stopped = !state.stopped
})

const table = ref();

</script>

<template lang="pug">
.flex.flex-col.w-full.flex-auto
control-scale.mb-4
.flex.flex-wrap.p-4
  table-switch(
    label="letters",
    :state="state.show.letters",
    @click="state.show.letters = !state.show.letters"
  )
  table-switch(
    label="FREQ",
    :state="state.show.hz",
    @click="state.show.hz = !state.show.hz"
  )
  table-switch(
    label="Length",
    :state="state.show.len",
    @click="state.show.len = !state.show.len"
  )
  table-switch(
    label="BPM",
    :state="state.show.bpm",
    @click="state.show.bpm = !state.show.bpm"
  )
  .flex.border-1.px-2.rounded-lg.items-center
    .p-1.pr-2.font-bold A
    input.mx-1.p-2.max-w-16(
      v-model="state.middleA" 
      type="number")
    .p-1 Hz
  transition(name="fade")
    table-switch(
      v-if="!state.stopped"
      label="STOP",
      :state="state.stopped",
      @click="state.stopped = !state.stopped"
    )
  .flex-1
  full-screen(:el="table")
.fullscreen-container(ref="table")
  table-shift(:top="true")
  .flex.w-full(
    v-for="octave in state.octave.list", 
    :key="octave")
    table-cell(
      v-for="(note, pitch) in notes" 
      :key="note", 
      :class="{ dim: !globalScale.isIn(note) }", 
      :pitch="pitch", 
      :octave="octave") 
  table-shift

</template>

<style lang="postcss" scoped>
.dim {
  @apply opacity-20;
}
</style>
