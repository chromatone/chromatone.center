<template lang="pug">
.flex.flex-col
  state-midi-panel.max-w-55ch(:toChannel="false")
  .flex.mt-4
    .flex.flex-col.flex-1.text-center(v-for="ch in midi.channels", :key="ch.num")
      .header {{ ch.num }}
      midi-note(
        v-for="note in sortNotes(ch.notes)", 
        :key="note?.name"
        :note="note"
        v-model:active="active"
        @play="midiAttack(note)"
        @stop="midiRelease(note)"
      )
  .flex
    .flex.flex-col.flex-1.text-center(v-for="ch in midi.channels", :key="ch.num")
      midi-cc(
        v-for="cc in ch.cc"
        :key="cc.number"
        :cc="cc"
        @update="setCC(cc, $event)"
      )
</template>

<script setup>
import { ref } from 'vue'
import { useMidi } from '@use/midi.js'
import { pitchColor } from 'chromatone-theory'

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

<style lang="postcss" scoped>
.header {
  @apply p-2 m-1px font-bold bg-gray-500 bg-opacity-50;
}
</style>