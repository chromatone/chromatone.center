<template lang="pug">
.flex.flex-col
  .flex.items-center.justify-center
    .flex
      .p-2.m-2.border.border-green-500.text-green-500(v-if="midi.enabled") 
        span(v-if="Object.entries(midi.inputs).length > 0") MIDI
        span(v-else) Plug in your MIDI device
      .p-2.border.border-red-500.text-red-500(v-else) MIDI NOT AVAILABLE
    .button(v-for="input in midi.inputs") 
      .font-bold {{ input.name }}
    .play.button(@click="midi.playing = !midi.playing")
      la-play(v-if="!midi.playing")
      la-pause(v-else)

    .button(@click="midi.channels = {}")
      ph-eraser
  .flex.mt-4
    .flex.flex-col.flex-1.text-center(v-for="ch in midi.channels", :key="ch.num")
      .header {{ ch.num }}
      midi-note(
        v-for="note in sortNotes(ch.notes)", 
        :key="note.name"
        :note="note"
        v-model:active="active"
        @play="playNote(note)"
        @stop="stopNote(note)"
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

const { midi, playNote, stopNote, setCC } = useMidi();

function sortNotes(notes) {
  if (!notes) return []
  let arr = Object.values(notes)
  return arr.sort((a, b) => {
    return a.number > b.number ? -1 : 1
  })
}

</script>

<style scoped>
.header {
  @apply p-2 m-1px font-bold bg-gray-500 bg-opacity-50;
}
.button {
  @apply p-2 m-2 border border-gray-500 cursor-pointer select-none;
}
</style>