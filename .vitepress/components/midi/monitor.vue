<template lang="pug">
.flex.items-center.justify-center
  .flex.m-2.cursor-pointer.select-none
    .p-2.border.border-green-500.text-green-500(v-if="WebMidi.supported && state.enabled") 
      span(v-if="Object.entries(state.input).length > 0") MIDI
      span(v-else) Plug in your MIDI device
    .p-2.border.border-red-500.text-red-500(v-else) MIDI NOT AVAILABLE
  .flex
    .p-2.m-2.border.border-gray-500(v-for="input in state.input") 
      .font-bold {{ input.name }}
      .play(v-if="input.playing !== null")
        la-play(v-if="input.playing")
        la-pause(v-else)
      .text-gray-200 {{ input.msg }}

</template>

<script setup>
import { useMidi } from '@use/midi.js'

const { state, WebMidi } = useMidi();

</script>

<style scoped>
</style>