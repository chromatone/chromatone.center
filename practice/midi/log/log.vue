<script setup>
import { pitchColor } from '@use/calculations'
import { useMidi } from '@use/midi'
import { Utilities } from 'webmidi'
const active = ref(false)

const { midi, midiAttack, midiRelease, setCC } = useMidi();

function sortNotes(notes) {
  if (!notes) return []
  let arr = Object.values(notes)
  return arr.sort((a, b) => {
    return a.number < b.number ? -1 : 1
  })
}
</script>

<template lang='pug'>
.flex.flex-col.gap-1.mb-8.overflow-x-scroll.p-4.font-mono
  transition-group(name="fall" mode="out-in")
    .flex.text-sm.fall.whitespace-nowrap(v-for="ev in midi.log" :key="ev")
      .txt CH {{ ev.message?.channel }}
      .txt {{ ev.message?.type }}
      .txt {{ ev.data }}
      .p-2(:style="{ backgroundColor: pitchColor(ev.message.dataBytes[0] + 3 || 0) }")

      .txt.whitespace-nowrap  {{ Utilities.toNoteIdentifier(ev.message.dataBytes[0] || 1) }}
      .txt {{ ((ev.message.dataBytes[1]) / 127).toFixed(2) }}
      
</template>


<style lang="postcss" scoped>
.txt {
  @apply p-1 flex-1;
}
</style>

<route lang="yaml">
title: Log
subtitle: by Chromatone 
</route>