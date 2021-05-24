<template lang="pug">
.midi-panel
  .max-w-55ch.m-auto.layer
    .flex.items-center.justify-center.flex-wrap.py-2.m-auto
      .flex.m-2
        a.font-normal.p-2.border.border-green-500.text-green-500.select-none(v-if="midi.enabled", href="/explore/monitor/") 
          span(v-if="Object.entries(midi.outputs).length > 0") MIDI 
          span(v-else) Plug in your MIDI device
        .p-2.border.border-red-500.text-red-500(v-else) MIDI NOT AVAILABLE
      //- .m-2.p-2.rounded-full.transition-all.duration-50.cursor-pointer(
      //-   @mousedown="playNote(midi.note)"
      //-   @mouseup="stopNote(midi.note)"
      //-   v-if="midi.note"
      //-   :style="{ backgroundColor: pitchColor(midi.note.pitch, midi.note.octA) }"
      //- )
      .button.w-3em.transition-all.duration-50.cursor-pointer(
        @mousedown="playNote(midi.note)"
        @mouseup="stopNote(midi.note)"
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
        span TO CH
        input.ch.ml-2(type="number", max="16",min="1",length="12", v-model="midi.channel")
      
</template>

<script setup>
import { defineProps } from 'vue'
import { midi, stopAll, playNote, stopNote } from '@use/midi.js'
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
  @apply shadow-md rounded-md;
  background-color: hsla(0, 0%, 100%, 0.6);
  backdrop-filter: blur(30px);
}

input.ch {
  @apply pl-2 w-2.5em bg-transparent;
}

.dark .layer {
  background-color: hsla(0, 0%, 0%, 0.3);
}

.button {
  @apply p-2 m-2 border flex items-center rounded cursor-pointer select-none;
}
</style>