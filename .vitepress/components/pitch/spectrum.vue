<template lang="pug">
.flex.justify-center(v-if="!state.initiated" )
  start-button(@click="init()") Start
.flex.flex-col(v-else)
  svg#tuner.rounded-xl.w-full.max-h-3xl.-z3(
    v-if="state.running"
    version="1.1",
    baseProfile="full",
    viewBox="0 0 400 400",
    xmlns="http://www.w3.org/2000/svg",
    )

    line(
      style="transition:all 500ms ease; "
      v-for="(bar,i) in state.spec.slice(0,400)",
      :key="i",
      :stroke="state?.note?.color"
      stroke-linecap="round"
      stroke-width="2"
      :y1="400 - i",
      :x1="200 - bar",
      :y2="400 - i",
      :x2="200 + bar"
    )
</template>
  
<script setup>
import { pitchColor, freqPitch, rotateArray, scales, notes, getCircleCoord } from 'chromatone-theory'
import { defineProps, reactive } from 'vue'
import { useTuner } from '@use/tuner.js'
const { init, state, chain } = useTuner();


</script>
  
<style scoped>
</style>