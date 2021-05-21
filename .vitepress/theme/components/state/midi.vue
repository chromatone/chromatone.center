<template lang="pug">
.midi(
  :class="{ active: panel }"
  )
  button.p-2(@click="panel = !panel")
    mdi-midi-input.transition-all.duration-200(
      :style=`{
        opacity: midi.enabled ? 1 : 0.2,
        color: pitchColor(midi.note?.pitch, midi.note?.octA)
      }`
      class="visible"
    )
  client-only
    transition(name="panel")
      state-midi-panel.absolute.right-0.top-16.w-full(v-if="panel")
</template>

<script setup>
import { useMidi } from '@use/midi.js'
import { pitchColor } from 'chromatone-theory'
import { useStorage } from '@vueuse/core'

const panel = useStorage('global-midi-panel', false)

const { midi } = useMidi();
</script>

<style scoped>
.midi.active {
  @apply bg-light-700 dark:bg-dark-700;
}
</style>