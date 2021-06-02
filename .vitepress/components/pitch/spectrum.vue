<template lang="pug">
.flex.justify-center(v-if="!state.initiated" )
  start-button(@click="init()") Start
.flex.flex-col(v-else)
  svg#tuner.rounded-xl.w-full.max-h-3xl.-z3(
    v-if="state.running"
    version="1.1",
    baseProfile="full",
    viewBox="0 0 400 310",
    xmlns="http://www.w3.org/2000/svg",
    )
    line(
      style="transition:all 300ms ease; "
      width="100%"
      height="10"
      :y1="150"
      :y2="150"
      :x1="0"
      :x2="400"
      :stroke="state?.note?.color"
      :stroke-width="state.rms * 100"
      stroke-linecap="round"
    )
    line(
      style="transition:all 200ms ease; "
      v-for="(bar,i) in state.spec.slice(0,100)",
      :key="i",
      stroke="hsla(0,0%,50%,1)"
      stroke-linecap="round"
      stroke-width="2"
      :x1="i * 4",
      :y1="150 - bar",
      :x2="i * 4",
      :y2="150 + bar"
    )
p {{ state?.note }}
</template>
  
<script setup>
import { pitchColor, freqPitch, rotateArray, scales, notes, getCircleCoord } from 'chromatone-theory'
import { defineProps, reactive } from 'vue'
import { useTuner } from '@use/tuner.js'
const { init, state, chain } = useTuner();


</script>
  
<style scoped>
</style>