<script setup>
import { useMidi } from "@use/midi.js";
import { pitchColor } from "@use/calculations";
import { useAudio } from "@use/audio";
import { useSynth, quantizeModes } from "@use/synth";

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
client-only
  button(@click.stop="open.midi = !open.midi" aria-label="Toggle MIDI panel" :class="{active:open.midi}")
    mdi-midi-input.transition-all.duration-200.text-xl(
      :style=`{
        opacity: midi.enabled ? 1 : 0.2,
        color: pitchColor(midi.note?.pitch)
      }`
      class="visible"
    )
  button.text-xl(
    @click.stop.prevent="open.synth = !open.synth"
    aria-label="Toggle synth panel"
    :class="{ active: open.synth }"
    )
    la-wave-square
  button(
    @click.stop="open.tempo = !open.tempo"  
    :class="{ active: open.tempo }" 
    aria-label="Toggle tempo panel")
    fad-metronome.text-xl
  button.text-xl(
    @click.stop.prevent="open.audio = !open.audio"
    :class="{active: open.audio}"
    aria-label="Toggle audio panel"
    )
    bi-volume-up(v-if="!audio.mute")
    bi-volume-mute(v-else)
  button(
    @click="open.record = !open.record"
    :class="{active: open.record}"
    aria-label="Toggle record panel"
    )
    bi-record-circle
  side-panel(v-model:open="open.midi")
    midi-panel
  side-panel(v-model:open="open.synth")
    synth-panel
  side-panel(v-model:open="open.tempo")
    state-transport
  side-panel(v-model:open="open.audio")
    state-audio
  side-panel(v-model:open="open.record")
    cast-panel
</template>

<style lang="postcss" scoped>
button {
  @apply p-2 rounded-xl transition;
}

button.active {
  @apply bg-light-700 dark_bg-dark-700;
}
</style>
