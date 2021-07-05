<template lang="pug">
.m-auto.layer.w-full
  .flex.items-center.justify-center.flex-wrap.py-2.m-auto
    .flex.m-2
      a.font-normal.p-2.border.border-green-500.text-green-500.select-none(v-if="midi.enabled", href="/explore/monitor/") 
        span(v-if="Object.entries(midi.outputs).length > 0") MIDI 
        span(v-else) Plug in your MIDI device
      .p-2.border.border-red-500.text-red-500(v-else) MIDI NOT AVAILABLE
    .button.opacity-30(@click="midi.out = !midi.out",:class="{ active: midi.out }") OUT
    .button.w-3em.transition-all.duration-50.cursor-pointer(
      @mousedown="midiAttack(midi.note)"
      @mouseup="midiRelease(midi.note)"
      v-if="midi.note?.name"
      :style="{ borderColor: pitchColor(midi.note.pitch, midi.note.octA), color: pitchColor(midi.note.pitch, midi.note.octA) }"
    ) 
      .w-2em {{ midi.note.name.slice(0, -1) }} 
      .flex {{ midi.note.name.slice(-1) }}
    .play.button(@click="midi.playing = !midi.playing")
      la-play(v-if="!midi.playing")
      la-pause(v-else)

    .button.border(@click="stopAll()")
      la-stop
    .button.border(v-for="output in midi.outputs")  
      span {{ output.name }}
    .button(v-if="toChannel")
      span CH
      input.ch.ml-2(
        type="number", 
        inputmode="numeric"
        pattern="[0-9]*"
        max="16",min="1",length="12", 
        v-model="midi.channel")
      
</template>

<script setup>
import { midi, stopAll, midiAttack, midiRelease } from '@use/midi.js'
import { pitchColor } from 'chromatone-theory'

const props = defineProps({
  toChannel: {
    type: Boolean,
    default: true,
  }
});
</script>

<style scoped>
.midi-panel {
  @apply z-1;
}

.layer {
  @apply;
  background-color: hsla(0, 0%, 100%, 0.8);
  backdrop-filter: blur(30px);
}

input.ch {
  @apply pl-2 w-2.5em bg-transparent;
}

.dark .layer {
  background-color: hsla(0, 0%, 0%, 0.8);
}

.button {
  @apply p-2 m-2 border flex items-center rounded cursor-pointer select-none;
}
.button.active {
  @apply opacity-100;
}
</style>