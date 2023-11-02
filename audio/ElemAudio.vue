<script setup>
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
  AnalysisFFT
  SynthMain
  InputMic
</template>
