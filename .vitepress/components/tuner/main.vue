<template lang="pug">
.flex.flex-col
  .p-4.bg-gray-300(@click="init()") Init
  .p-4.text-md {{ state.note }}
  canvas.bars(ref="freqBars")
</template>

<script setup>
import { defineProps, ref, reactive, onMounted } from 'vue'
import { useFreqBars } from './useFreqBars.js'
import { useTuner } from './useTuner.js'

const { freqBars, updateFreqBars } = useFreqBars();
const { init, state } = useTuner();


</script>

<style scoped>
.bars {
  @apply absolute -z-2;
}
</style>