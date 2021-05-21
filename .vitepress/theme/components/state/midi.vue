<template lang="pug">
.midi(
  :class="{ active: midi.panel }"
  )
  button.p-2(@click="midi.panel = !midi.panel")
    mdi-midi-input.transition-all.duration-200(
      :style=`{
        opacity: midi.enabled ? 1 : 0.2,
        color: pitchColor(midi.note?.pitch, midi.note?.octA)
      }`
    )
  transition(name="panel")
    midi-panel(v-if="midi.panel")
</template>

<script setup>
import { useMidi } from '@use/midi.js'
import { pitchColor } from 'chromatone-theory'
const { midi } = useMidi();
</script>

<style scoped>
.midi.active {
  @apply bg-light-700 dark:bg-dark-700;
}
</style>