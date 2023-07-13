<script setup>
import ElemSequencer from "./ElemSequencer.vue";
import ElemSynth from "./ElemSynth.vue";
import ElemInput from "./ElemInput.vue";
import ElemFFT from "./ElemFFT.vue";
import { useElemAudio } from "./useElemAudio";


const { audio, render, meters } = useElemAudio()



</script>

<template lang="pug">
.p-4.flex.flex-col.gap-4
  .text-2xl.p-2 Elementary audio
  button.text-button(@click="render()") RENDER
  pre {{ audio.initiated }} {{ audio.started }}
  .text-xs {{ meters }}
  //- ElemFFT
  //- ElemSequencer
  //- ElemInput
  //- ElemSynth

</template>
