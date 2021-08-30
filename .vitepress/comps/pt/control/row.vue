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
    label="BPM",
    :state="state.show.bpm",
    @click="state.show.bpm = !state.show.bpm"
  )

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