<template lang="pug">
.m-auto.layer.w-full.z-40
  .p-2.border.border-red-500.text-red-500(v-if="!midi.enabled") MIDI is not available. Use a 
    a.font-normal.underline(href="https://caniuse.com/?search=midi" target="_blank") compatible browser 
    span or 
    a.font-normal.underline(href="https://apps.apple.com/ru/app/web-midi-browser/id953846217" target="_blank") Web MIDI Browser on iOS
  .flex.items-center.justify-center.flex-wrap.py-2.m-auto(v-else)
    .flex.m-2
      a.font-normal.p-2.border.border-green-500.text-green-500.select-none.rounded-lg(href="/explore/monitor/") 
        span(v-if="midi.available") MIDI 
        span(v-else) Plug in your MIDI device
    .text-button.opacity-30(@click="midi.out = !midi.out",:class="{ active: midi.out }") OUT
    .text-button.w-3em.transition-all.duration-50.cursor-pointer.flex(
      @mousedown="midiAttack(midi.note)"
      @mouseup="midiRelease(midi.note)"
      v-if="midi.note?.name"
      :style="{ borderColor: pitchColor(midi.note.pitch, midi.note.octA), color: pitchColor(midi.note.pitch, midi.note.octA) }"
    ) 
      .w-2em {{ midi.note.name }} 
      .flex-1 {{ midi.note.accidental }}
    button.play.text-button(@click="midi.playing = !midi.playing")
      la-play(v-if="!midi.playing")
      la-pause(v-else)
    button.text-button.border(@click="stopAll()")
      la-stop
    .text-button.border(v-for="output in midi.outputs")  
      span {{ output.name }}
    .text-button(v-if="toChannel")
      span CH
      input.ch.ml-2(
        type="number", 
        inputmode="numeric"
        pattern="[0-9]*"
        max="16",min="1",length="12", 
        v-model="midi.channel")
    midi-filter.mx-2
    .is-group.mx-1.p-1
      slot
</template>

<script setup>
import { midi, stopAll, midiAttack, midiRelease } from '@use/midi.js'
import { onKeyStroke } from '@vueuse/core'
import { pitchColor } from '@theory'

const props = defineProps({
  toChannel: {
    type: Boolean,
    default: true,
  }
});

onKeyStroke(' ', ev => {
  ev.preventDefault()
  midi.playing = !midi.playing
});
</script>

<style scoped>
.layer {
  @apply bg-light-200 dark_bg-dark-900 rounded-xl;
  backdrop-filter: blur(30px);
}

input.ch {
  @apply pl-2 w-2.5em bg-transparent;
}

.button {
  @apply p-2 m-2 border flex items-center rounded cursor-pointer select-none;
}
.button.active {
  @apply opacity-100;
}
</style>