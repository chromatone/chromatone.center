<script setup>
import ElemSequencer from "./drums/ElemSequencer.vue";
import MainSynth from "./synth/MainSynth.vue";
import MicInput from "./input/MicInput.vue";
import ElemFFT from "./analysis/AnalysisFFT.vue";
import ElemMetronome from "./time/ElemMetronome.vue";

import { synth } from "#/use";
import { onBeforeUnmount, onMounted } from "vue";

onMounted(() => {
  synth.state.midi = false
})

onBeforeUnmount(() => {
  synth.state.midi = true
})
</script>

<template lang="pug">
.flex.flex-col.gap-4
  ElemFFT
  MainSynth
  ElemMetronome
  ElemSequencer
  MicInput
</template>
