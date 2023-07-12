<script setup>
import DrumSequencer from "./DrumSequencer.vue";
import ElemSynth from "./ElemSynth.vue";
import ElemInput from "./ElemInput.vue";
import FFTScope from "./FFTScope.vue";

</script>

<template lang="pug">
.p-4.flex.flex-col.gap-4
  .text-2xl.p-2 Elementary audio
  FFTScope
  DrumSequencer
  ElemInput
  ElemSynth

</template>
