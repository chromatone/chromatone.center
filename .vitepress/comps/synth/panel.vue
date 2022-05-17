<script setup>
import { useSynth, quantizeModes } from "@use/synth";
import { midi } from "@use/midi";

const { synth, synthOnce, init, synthReleaseAll } = useSynth();

let count = 0;

function cycle() {
  count++;
  synth.state.quantize = quantizeModes[count % quantizeModes.length];
}
</script>

<template lang="pug">
.flex.flex-col.w-full.gap-2
  .flex.flex-wrap
    button.flex-button(
      :class="{ active: synth.state.initiated }"
      @click="synthOnce()" 
      aria-label="Test synth sound"
      )
      la-wave-square.text-xl
      .m-0 Play synth
    button.flex-button(
      @click="synthReleaseAll()"
      aria-label="Panic synth release"
      )
      la-ban.text-xl
      .m-0 Stop synth
  .flex.flex-wrap
    synth-oscillators.is-group(v-model="synth.params.oscillator.type")
    control-knob(
      :min="0"
      :max="1"
      :step="0.001"
      v-model="synth.state.volume"
      param="VOL"
    )
  .flex.is-group
    button.flex-button(
      @click="synth.state.quantize.next()"
      aria-label="Synth panel"
      ) Quantize 
      .font-bold {{ synth.state.quantize.state }}
    button.flex-button(

      ) Octave
      .font-bold {{ midi.offset > 0 ? '+' : '' }}{{ midi.offset }}
  .flex.flex-wrap
    button.flex-button.border(
      @click="midi.keyboard = !midi.keyboard" 
      aria-label="Play MIDI with PC keyboard"
      :class="{ active: midi.keyboard }"
      )
      tabler-keyboard.text-2xl
      .m-0 Pc Keyboard
    button.flex-button.border(
      @click="synth.state.midi = !synth.state.midi" 
      aria-label="Play synth on MIDI input"
      :class="{ active: synth.state.midi }"
      )
      mdi-midi-input.text-2xl
      .m-0 MIDI Synth
</template>

<style lang="postcss" scoped>
.mute {
  font-size: 1.1em;
}

.panel {
  @apply absolute right-0 top-$header-height w-full p-4 bg-light-300 dark_bg-dark-300 z-20 flex bg-opacity-90 dark_bg-opacity-90 flex-wrap items-center shadow-lg;
}
</style>
