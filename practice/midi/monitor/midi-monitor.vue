<script setup>
import midiNote from './note.vue'
import midiCc from './cc.vue'
import { ref, computed } from 'vue';
import { Chord, Midi } from '@tonaljs/tonal';


import { useMidi, sortNotes } from '#/use/midi'



const active = ref(false)

const { midi, midiAttack, midiRelease, setCC } = useMidi();

const chords = computed(() => {
  const chords = {}
  for (let channel in midi.channels) {
    const list = Object.keys(midi.channels[channel].activeNotes).map(n => Midi.midiToNoteName(n, { sharps: true }))
    chords[channel] = list.length > 2 ? Chord.detect(list) : []
  }

  return chords
})

</script>

<template lang="pug">
.flex.flex-col.gap-4 
  midi-panel(:to-channel="false")
  .fullscreen-container#screen(@mouseleave="active = false")
    .flex.w-full.h-full.mt-4
      .flex.flex-col.flex-1.text-center(
        v-for="(ch, chNum) in midi.channels", 
        :key="ch.num")
        .header {{ chords[chNum]?.[0] || Object.keys(ch.activeNotes).map(n => Midi.midiToNoteName(n, { sharps: true })).join(' ') || ch.num }} 
        midi-note(
          v-for="note in sortNotes(ch.notes)", 
          :key="note.number"
          v-model:active="active"
          :note="note"
          @play="midiAttack(note)"
          @stop="midiRelease(note)"
        )
    .flex.w-full
      .flex.flex-col.flex-1.text-center(
        v-for="ch in midi.channels", 
        :key="ch.num") 
        midi-cc(
          v-for="cc in ch.cc"
          :key="cc"
          :cc="cc"
          @update="setCC(cc, $event)"
        )

</template>

<style lang="postcss"  scoped>
.header {
  @apply p-2 m-1px font-bold bg-gray-500 bg-opacity-50;
}
</style>