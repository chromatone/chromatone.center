<template lang="pug">
.midi-panel
  .max-w-55ch.m-auto 
    .flex.items-center.justify-center
      .flex
        .p-2.m-2.border.border-green-500.text-green-500(v-if="midi.enabled") 
          span(v-if="Object.entries(midi.inputs).length > 0") MIDI
          span(v-else) Plug in your MIDI device
        .p-2.border.border-red-500.text-red-500(v-else) MIDI NOT AVAILABLE
      .button(v-for="input in midi.inputs") 
        .font-bold {{ input.name }}
      .p-2.m-2.rounded-full.transition-all.duration-50(
        v-if="midi.note"
        :style="{ backgroundColor: pitchColor(midi.note.pitch, midi.note.octA) }"
      )
      .play.button(@click="midi.playing = !midi.playing")
        la-play(v-if="!midi.playing")
        la-pause(v-else)

      .button(@click="midi.channels = {}")
        ph-eraser
</template>

<script setup>
import { midi } from '@use/midi.js'
import { pitchColor } from 'chromatone-theory'
</script>

<style scoped>
.midi-panel {
  @apply -z-2 absolute right-0 top-4rem w-full bg-light-500 bg-opacity-96 backdrop-blur-md;
}

.button {
  @apply p-2 m-2 border border-gray-500 cursor-pointer select-none;
}
</style>