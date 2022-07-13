<script setup>
import { useMidi } from "#use/midi.js";
import { pitchColor } from "#use/calculations";
import { useAudio } from "#use/audio";
import { useSynth, quantizeModes } from "#use/synth";
import { tempo } from '#use/tempo'

const { init } = useSynth();

const { midi } = useMidi();
const { audio } = useAudio();
const open = reactive({
  midi: false,
  synth: false,
  tempo: false,
  audio: false,
  record: false,
});
</script>

<template lang="pug">
button(
  style="transition: all 100ms ease-out"
  @click="open.tempo = !open.tempo"  
  :class="{ active: open.tempo }" 
  aria-label="Toggle tempo panel"
  :style="{ color: tempo.blink ? tempo.color : 'currentColor' }"
  v-tooltip.bottom="'Tempo options'"
  )
  mdi-metronome.text-xl
button(
  @click="open.midi = !open.midi" 
  aria-label="Toggle MIDI panel" 
  v-tooltip.bottom="'MIDI options'"
  :class="{ active: open.midi }"
  )
  mdi-midi-input.transition-all.duration-200.text-xl(
    :style="{ color: pitchColor(midi.note?.pitch) }"
    class="visible"
  )
button.text-xl(
  @click="open.synth = !open.synth"
  aria-label="Toggle synth panel"
  :class="{ active: open.synth }"
  v-tooltip.bottom="'Synth options'"
  )
  la-wave-square
button.text-xl(
  @click="open.audio = !open.audio"
  :class="{ active: open.audio }"
  aria-label="Toggle audio panel"
  v-tooltip.bottom="'Audio options'"
  )
  bi-volume-up(v-if="!audio.mute")
  bi-volume-mute(v-else)
button(
  @click="open.record = !open.record"
  :class="{ active: open.record }"
  aria-label="Toggle record panel"
  v-tooltip.bottom-end="'Record options'"
  )
  bi-record-circle
side-panel(v-model:open="open.midi")
  midi-panel
side-panel(v-model:open="open.synth")
  synth-panel
side-panel(v-model:open="open.tempo")
  state-transport
side-panel(v-model:open="open.audio")
  state-sound
side-panel(v-model:open="open.record")
  cast-panel

midi-notes
</template>

<style lang="postcss" scoped>
button {
  @apply p-2 rounded-xl transition;
}

button.active {
  @apply bg-light-700 dark_bg-dark-700;
}
</style>
