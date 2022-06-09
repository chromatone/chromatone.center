<script setup>
import midiNote from './note.vue'
import midiCc from './cc.vue'

import { useMidi } from '@use/midi.js'
const active = ref(false)

const { midi, midiAttack, midiRelease, setCC } = useMidi();

function sortNotes(notes) {
  if (!notes) return []
  let arr = Object.values(notes)
  return arr.sort((a, b) => {
    return a.number > b.number ? -1 : 1
  })
}

</script>

<template lang="pug">
.flex.flex-col
  midi-panel(:toChannel="false")
    full-screen
  .fullscreen-container#screen(@mouseleave="active = false")

    .flex.w-full.h-full.mt-4
      .flex.flex-col.flex-1.text-center(v-for="ch in midi.channels", :key="ch.num")
        .header {{ ch.num }}
        midi-note(
          v-for="note in sortNotes(ch.notes)", 
          :key="note.number"
          :note="note"
          v-model:active="active"
          @play="midiAttack(note)"
          @stop="midiRelease(note)"
        )
    .flex.w-full
      .flex.flex-col.flex-1.text-center(v-for="ch in midi.channels", :key="ch.num")
        midi-cc(
          v-for="cc in ch.cc"
          :key="cc.number"
          :cc="cc"
          @update="setCC(cc, $event)"
        )
</template>

<style lang="postcss"  scoped>
.header {
  @apply p-2 m-1px font-bold bg-gray-500 bg-opacity-50;
}
</style>