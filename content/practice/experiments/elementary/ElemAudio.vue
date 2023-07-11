<script setup>
import DrumSequencer from "./DrumSequencer.vue";
import ElemSynth from "./ElemSynth.vue";
import ElemInput from "./ElemInput.vue";

</script>

<template lang="pug">
.p-4.bg-light-200.dark-bg-dark-200.shadow.rounded.flex.flex-col.gap-4
  .text-2xl.p-2 Elementary audio
  DrumSequencer
  ElemInput
  ElemSynth

</template>
