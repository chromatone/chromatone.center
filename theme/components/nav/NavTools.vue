<script setup>
import { useMidi } from "#/use/midi";
import { noteColor } from '#/use/colors'
import { useAudio } from "#/use/audio";
import { tempo } from '#/use/tempo'
import { reactive } from 'vue'
import { onKeyStroke } from "@vueuse/core";
import { drawingEnabled, drawingPinned } from '../../composables/draw'

const { midi } = useMidi();
const { audio } = useAudio();
const open = reactive({
  search: false,
  midi: false,
  synth: false,
  tempo: false,
  audio: false,
  record: false,
});

onKeyStroke('Escape', () => {
  for (let p in open) {
    open[p] = false
  }
})
</script>

<template lang="pug">
.buttons.fixed.top-3.right-2.opacity-30.hover-opacity-100.transition.flex.items-center.gap-0.z-400.bg-light-300.rounded-xl.bg-opacity-20.backdrop-blur-md.dark-bg-dark-200.dark-bg-opacity-20
  state-dark.opacity-70.hover-opacity-100.transition
  button.text-xl.opacity-80.hover-opacity-100.transition(
    @click="drawingEnabled = !drawingEnabled"
    :class="{ active: drawingEnabled }"
    v-tooltip.top="'Draw on the screen'"
    )
    .i-carbon-pen

  button(
    style="transition: all 100ms ease-out"
    @click="open.tempo = !open.tempo"  
    :class="{ active: open.tempo }" 
    aria-label="Toggle tempo panel"
    :style="{ color: tempo.blink ? tempo.color : 'currentColor' }"
    v-tooltip.bottom="'Tempo options'"
    )
    .i-mdi-metronome.text-xl
  button(
    @click="open.midi = !open.midi" 
    aria-label="Toggle MIDI panel" 
    v-tooltip.bottom="'MIDI options'"
    :class="{ active: open.midi }"
    )
    .i-mdi-midi-input.transition-all.duration-200.text-xl(
      :style="{ color: noteColor(midi.note?.pitch) }"
      class="visible"
    )
  button.text-xl(
    @click="open.synth = !open.synth"
    aria-label="Toggle synth panel"
    :class="{ active: open.synth }"
    v-tooltip.bottom="'Synth options'"
    )
    .i-la-wave-square
  button.text-xl(
    @click="open.audio = !open.audio"
    :class="{ active: open.audio }"
    aria-label="Toggle audio panel"
    v-tooltip.bottom="'Audio options'"
    )
    .i-bi-volume-up(v-if="!audio.mute")
    .i-bi-volume-mute(v-else)
side-panel.z-400(v-model:open="open.search")
  nav-search(@close="open.search=false" :focus="open.search")
side-panel.z-400(v-model:open="open.midi")
  midi-panel
  img.mt-4(src="/media/apps/pc-keyboard-3.svg")
side-panel.z-400(v-model:open="open.synth")
  synth-panel
side-panel.z-400(v-model:open="open.tempo")
  state-transport
side-panel.z-400(v-model:open="open.audio")
  state-sound

midi-notes
</template>

<style lang="postcss" scoped>
button {
  @apply p-2 rounded-xl transition;
}

button.active {
  @apply bg-light-700 dark-bg-dark-700;
}
</style>
