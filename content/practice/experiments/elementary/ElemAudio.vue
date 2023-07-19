<script setup>
// import ElemSequencer from "./ElemSequencer.vue";
import ElemSynth from "./ElemSynth.vue";
// import ElemInput from "./ElemInput.vue";
// import ElemFFT from "./ElemFFT.vue";

// import ElemTime from "./ElemTime.vue";

import { useElemAudio } from "./useElemAudio"

const { audio, render, meters, } = useElemAudio()

</script>

<template lang="pug">
.p-4.flex.flex-col.gap-4
  .p-2.flex.gap-2.items-center 

  button.text-button.flex.gap-2.items-center(@click="render()") RENDER
    .i-la-plug(v-if="audio?.initiated")
  //- ElemTime
  //- ElemFFT
  //- ElemSequencer
  //- ElemInput
  ElemSynth(title="one")
  //- ElemSynth(title="two")

</template>
