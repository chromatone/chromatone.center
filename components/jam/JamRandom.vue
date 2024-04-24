<script setup>
import { ref } from 'vue'
import { globalScale, tempo } from '#/use'
import { useClamp } from '@vueuse/math';
import { TransitionPresets, useTransition } from '@vueuse/core'

var meanTempo = 102; // Среднее значение темпа
var stdDevTempo = 20; // Стандартное отклонение темпа

function randomNormalDistribution(mean, stdDev) {
  let u = 1 - Math.random()
  let v = 1 - Math.random()
  var normalDistribution = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + stdDev * normalDistribution;
}

const bpm = useClamp(102, 60, 180)

const output = useTransition(() => tempo.bpm, {
  duration: 1000,
  transition: TransitionPresets.easeInOutCubic,
})

const spin = ref(false)

function randomize() {
  if (spin.value) return
  spin.value = true
  tempo.bpm = Math.round(randomNormalDistribution(meanTempo, stdDevTempo));
  globalScale.chroma = Math.random() > .7 ? "101011010101" : "101101011010"
  globalScale.tonic = Math.round(Math.random() * 12)
  setTimeout(() => { spin.value = false }, 1000)
}

</script>

<template lang="pug">
#screen.bg-light-900.dark-bg-dark-800
  .flex.flex-col.gap-6.p-4.justify-between.relative.items-stretch.min-h-100vh(
  :style="{backgroundColor:`hsla(${30*globalScale.tonic}, 80%, 50%, 0.05)`}"
  )
    .text-4xl.text-center RANDOM JAM
    button.text-4xl.bg-dark-400.text-white.p-4.rounded-full.shadow-xl.mx-auto(@click="randomize()")
      .p-0(:class="{'animate-spin':spin}")
        .i-system-uicons-reset.-scale-y-100
    .flex.gap-4.text-center
      .text-4xl.flex-1.tabular-nums {{ output.toFixed() }} BPM
      .text-4xl.flex-1 {{ globalScale.note.name }} {{ globalScale?.set?.name }}
    chroma-keys(
      :chroma="globalScale.chroma"
      :pitch="globalScale.tonic")
      .p-0
         

    

</template>