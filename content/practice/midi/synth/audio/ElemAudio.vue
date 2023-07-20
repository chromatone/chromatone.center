<script setup>
import ElemSequencer from "../drums/ElemSequencer.vue";
import MainSynth from "../synth/SynthMain.vue";
import MicInput from "../input/MicInput.vue";
import ElemFFT from "../analysis/AnalysisFFT.vue";
import { useAudio } from "./useAudio";
import { ref } from "vue";
const { audio } = useAudio()

const scope = ref([])

audio.core.on('scope', e => {
  if (e?.source == 'main:scope') {
    let arr = [...e?.data[0].values()]
    // let zeroCross = arr.findIndex((v, i) => v * arr[i + 1] < 0)
    scope.value = arr //.slice(zeroCross)
  }
})
</script>

<template lang="pug">
.flex.flex-col.gap-4
  ElemFFT
  ElemSequencer
  MicInput
  MainSynth
  p {{ scope[0] }}

</template>
