<script setup>
import { useMidi, forwardMidi } from "@use/midi.js";
import { pitchColor } from "@use/calculations";
const { midi, midiAttack, midiRelease, setCC } = useMidi();

function inputColor(iid) {
  return midi.note.port == iid && midi.note.velocity > 0
    ? pitchColor(midi.note?.pitch, null, 1, 0.4)
    : "#7773";
}


</script>

<template lang="pug">
.flex.flex-wrap.gap-4.justify-center
  midi-router-input(
    :input="input"
    :iid="iid"
    v-for="(input, iid) in midi.inputs" 
    :key="iid"
    )
</template>

<style lang="postcss" scoped>
.active {
  @apply border-dark-200 dark_border-light-200;
}

.display {
  @apply overflow-hidden px-1 py-2px rounded-lg border-1 border-dark-50/50 w-16ch flex justify-between transition relative;
}

.indicator {
  @apply h-full w-full origin-left absolute top-0 left-0 border-r-1 transition border-dark-50/50 bg-dark-50 bg-opacity-20 dark_bg-light-50 dark_bg-opacity-20;
}
</style>
