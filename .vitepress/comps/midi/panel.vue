<script setup>
import { midi, stopAll, midiAttack, midiRelease } from "@use/midi.js";
import { onKeyStroke } from "@vueuse/core";
import { pitchColor } from "@use/calculations";
import { synth } from "@use/synth.js";

onKeyStroke(" ", (ev) => {
  ev.preventDefault();
  midi.playing = !midi.playing;
});

var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
</script>

<template lang="pug">
.m-auto.layer.w-full.z-40.flex.flex-col
  .p-2.border.border-red-500.text-red-500.flex.flex-wrap.gap-2.w-full(v-if="!midi.enabled") MIDI is not available. Please 
    template(v-if="isFirefox")
      a.font-normal.underline(href="/site_permissions_for_chromatonecenter-1.0-an+fx.xpi") Install site permission (recent Firefox)
      span or
    a.font-normal.underline(href="https://caniuse.com/?search=midi" target="_blank") use a compatible browser 
    span or 
    a.font-normal.underline(href="https://apps.apple.com/ru/app/web-midi-browser/id953846217" target="_blank") Web MIDI Browser on iOS
    span or 
    .font-normal.text-dark-200.dark_text-light-100 use your PC keyboard

  .flex.items-center.justify-center.flex-col.py-2.m-auto(v-else)
    .flex.m-2
      a.font-normal.p-2.border.border-green-500.text-green-500.select-none.rounded-lg(href="/apps/midi/monitor/") 
        span(v-if="midi.available") MIDI 
        span(v-else) Plug in your MIDI device
    .flex
      .is-group
        button.play.text-button(@click="midi.playing = !midi.playing")
          la-play(v-if="!midi.playing")
          la-pause(v-else)
        button.text-button.border(@click="stopAll()")
          la-stop
      .text-button.w-3em.transition-all.duration-50.cursor-pointer.flex(
        @mousedown="midiAttack(midi.note)"
        @mouseup="midiRelease(midi.note)"
        v-if="midi.note?.name"
        :style="{ borderColor: pitchColor(midi.note.pitch, midi.note.octA), color: pitchColor(midi.note.pitch, midi.note.octA) }"
        ) 
        .w-2em {{ midi.note.name }} 
        .flex-1 {{ midi.note.accidental }}
    .flex.flex-wrap
      button.flex-button.border(
        @click="midi.keyboard = !midi.keyboard" 
        aria-label="Play MIDI with PC keyboard"
        :class="{ active: midi.keyboard }"
        v-tooltip.bottom="'Play MIDI with PC keyboard'"
        )
        tabler-keyboard
        .m-0 PC keyboard
      button.flex-button.opacity-30(
        @click="midi.out = !midi.out",
        :class="{ active: midi.out }"
        v-tooltip.bottom="'Output MIDI to external devices'"
        ) 
        fad-midiplug
        .m-0 MIDI OUT
      button.flex-button.border(
        @click="synth.state.midi = !synth.state.midi" 
        :class="{ active: synth.state.midi }"
        v-tooltip.bottom="'Play synth on MIDI input'"
        )
        bi-volume-up(v-if="synth.state.midi")
        bi-volume-off(v-else)
        .m-0 MIDI Synth


    button.text-button.border(v-for="output in midi.outputs")  
      span {{ output.name }}
    midi-filter-channels.mx-2(style="flex: 1 1 100px")

    slot.is-group.mx-1.p-1
  img.mt-4(src="/media/apps/pc-keyboard-3.svg")
</template>

<style lang="postcss" scoped>
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
