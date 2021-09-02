<template lang="pug">
.flex.flex-wrap.p-4
  // .p-4.bg-green-400(@click="startContext()") Start
  pt-control-switch(
    label="letters",
    :state="state.show.letters",
    @click="state.show.letters = !state.show.letters"
  )
  pt-control-switch(
    label="FREQ",
    :state="state.show.hz",
    @click="state.show.hz = !state.show.hz"
  )
  pt-control-switch(
    label="Length",
    :state="state.show.len",
    @click="state.show.len = !state.show.len"
  )
  pt-control-switch(
    label="BPM",
    :state="state.show.bpm",
    @click="state.show.bpm = !state.show.bpm"
  )
  .flex.border-1.px-2
    .p-1.pr-2.font-bold A
    input.mx-1.px-1.max-w-16(type="number" v-model="state.middleA")
    .p-1 Hz
</template>

<script setup>

import { state } from '../state.js'
import { context, start } from 'tone'

function startContext() {
  if (context.state == "suspended") {
    start()
  }
}

</script>

<style scoped >
</style>