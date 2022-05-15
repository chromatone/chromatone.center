<script setup>
import { useSynth, quantizeModes } from "@use/synth";
import { midi } from "@use/midi";

const { synth, synthOnce, init } = useSynth();

let count = 0;

function cycle() {
  count++;
  synth.state.quantize = quantizeModes[count % quantizeModes.length];
}
</script>

<template lang="pug">
.flex.flex-wrap
  button.text-button.mute.p-2.flex.flex-col.items-center(
    :class="{ active: synth.state.initiated }"
    @click="synthOnce()" 
    aria-label="Test synth sound"
    )
    la-wave-square.text-4xl
  synth-oscillators(v-model="synth.params.oscillator.type")
  button.text-button(
    @click="synth.state.quantize.next()"
    aria-label="Synth panel"
    ) Quantize {{ synth.state.quantize.state }}
  .flex-1
  button.text-button.border(
    @click="midi.keyboard = !midi.keyboard" 
    aria-label="Play MIDI with PC keyboard"
    :class="{ active: midi.keyboard }"
    )
    tabler-keyboard.text-3xl
  button.text-button.border(
    @click="synth.state.midi = !synth.state.midi" 
    aria-label="Play synth on MIDI input"
    :class="{ active: synth.state.midi }"
    )
    mdi-midi-input.text-3xl
</template>

<style lang="postcss" scoped>
.mute {
  font-size: 1.1em;
}

.panel {
  @apply absolute right-0 top-$header-height w-full p-4 bg-light-300 dark_bg-dark-300 z-20 flex bg-opacity-90 dark_bg-opacity-90 flex-wrap items-center shadow-lg;
}
</style>
