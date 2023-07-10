<script setup>

import { useMic } from "./useMic";

import OscilloScope from "./OscilloScope.vue";
import { useAudio } from "./useAudio";
import DrumSequencer from "./DrumSequencer.vue";
import ElemSynth from "./ElemSynth.vue";


const mic = useMic();

const audio = useAudio()
</script>

<template lang="pug">
.p-4.bg-light-200.dark-bg-dark-200.shadow.rounded.flex.flex-col.gap-4
  .text-2xl.p-2 Elementary audio
  DrumSequencer
  OscilloScope
  button.text-button(@click="mic.isOpen = !mic.isOpen" :class="{['text-red-500']:mic.isOpen}") Open mic
  ElemSynth

</template>
