<script setup>
import ElemSequencer from "./ElemSequencer.vue";
import ElemSynth from "./ElemSynth.vue";
import ElemInput from "./ElemInput.vue";
import ElemFFT from "./ElemFFT.vue";
import { useElemAudio } from "./useElemAudio";
import ElemTime from "./ElemTime.vue";


const { audio, render, meters } = useElemAudio()

</script>

<template lang="pug">
.p-4.flex.flex-col.gap-4
  .p-2.flex.gap-2.items-center 
    .text-2xl Elementary audio
    .i-la-plug(v-if="audio.initiated")
    .i-la-volume-up(v-if="audio.started")
  button.text-button(@click="render()") RENDER
  ElemTime
  //- ElemFFT
  //- ElemSequencer
  //- ElemInput
  //- ElemSynth

</template>
