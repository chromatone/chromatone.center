<script setup>
import tableShift from './shift.vue'
import tableCell from './cell.vue'
import tableSwitch from './switch.vue'

import { notes } from '#/use/theory'
import { state } from './state'
import { globalScale } from '#/use/chroma'
import { onKeyStroke } from '@vueuse/core'
import { ref } from 'vue'

onKeyStroke('Enter', (e) => {
  e.preventDefault()
  state.stopped = !state.stopped
})

const table = ref();

</script>

<template lang="pug">
.flex.flex-wrap
  control-scale.mb-4.flex-auto(
    style="flex: 1 1 2rem;"
  )
  .flex.flex-col.p-2(
    style="flex: 10 1 6rem;"
  )
    .flex-auto.flex.flex-wrap.rounded-xl.dark-bg-dark-700.shadow.items-center.p-2.gap-2.relative
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
    transition(name="fade")
      table-switch.my-4(
        v-if="!state.stopped"
        label="STOP",
        :state="state.stopped",
        @click="state.stopped = !state.stopped"
      )
    .flex.px-2.rounded-lg.items-center.bg-light-300.dark-bg-dark-800
      .p-1.pr-2.font-bold A
      input.mx-1.p-2.max-w-26.dark-bg-dark-800(
        v-model="state.middleA" 
        type="number")
      .p-1 Hz

.fullscreen-container#screen
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
