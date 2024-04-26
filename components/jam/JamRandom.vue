<script setup>
import { computed, ref } from 'vue'
import { globalScale, tempo } from '#/use'
import { useClamp } from '@vueuse/math';
import { TransitionPresets, useTransition } from '@vueuse/core'
import { noteColor } from '#/use/colors'

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
const limitMeasures = useClamp(1024, 916, 1920)

function randomize() {
  if (spin.value) return
  tempo.stopped = true

  spin.value = true
  tempo.bpm = Math.round(randomNormalDistribution(meanTempo, stdDevTempo));
  globalScale.chroma = Math.random() > .7 ? "101011010101" : "101101011010"
  globalScale.tonic = Math.round(Math.random() * 12)

  setTimeout(() => { spin.value = false; tempo.playing = true }, 1000)

}


const position = computed(() => tempo.position?.split(':').map(Number))

const progress = computed(() => position.value?.[0] / limitMeasures.value)

</script>

<template lang="pug">
#screen.bg-light-900.dark-bg-dark-800
  .flex.flex-col.gap-6.p-4.justify-between.relative.items-stretch.min-h-100vh.transition.duration-1000(
  :style="{backgroundColor:`hsla(${30*globalScale.tonic}, 80%, 50%, 0.05)`}"
  )
    .text-4xl.text-center RANDOM JAM 
    .text-sm.text-center 
    .flex
      button.text-4xl.bg-dark-400.text-white.p-4.rounded-full.shadow-xl.mx-auto(@click="randomize()")
        .p-0(:class="{'animate-spin':spin}")
          .i-system-uicons-reset.-scale-y-100
    .flex.w-full.justify-center.relative



    .flex.gap-4.text-center.relative.items-center
      .text-4xl.flex-1.tabular-nums.border-b-4(:style="{borderColor: tempo.color}") {{ output.toFixed() }} BPM

      //- .absolute.flex-1.p-2.rounded-full.bg-dark-300.dark-bg-light-100(:style="{opacity: tempo.blink ? 1 : 0, backgroundColor:tempo.color}")
      .text-4xl.flex-1.border-b-4(:style="{borderColor: noteColor(globalScale.tonic)}") {{ globalScale.note.name }} {{ globalScale?.set?.name }}

    .flex.flex-col.gap-1
      .border-b-0.border-solid.border-black.dark-border-light-900.w-full.relative.flex.flex-col.gap-1

        .py-5.bg-dark-400.transition.duration-300(:style="{backgroundColor: noteColor(globalScale.tonic) ,width: `${progress*100}%`}")
        .py-1.op-80.bg-dark-400.transition.duration-300(:style="{backgroundColor: tempo.color ,width: `${((position[0]%256)+1)*25/64}%`}")
        .py-1.op-80.bg-dark-400.transition.duration-300(:style="{backgroundColor: tempo.color ,width: `${((position[0]%64)+1)*25/16}%`}")
        .py-1.op-80.bg-dark-400.transition.duration-300(:style="{backgroundColor: tempo.color ,width: `${((position[0]%16)+1)*25/4}%`}")
        .py-1.op-80.bg-dark-400.transition.duration-300(:style="{backgroundColor: tempo.color ,width: `${((position[0]%8)+1)*25/2}%`}")
        .py-1.op-80.bg-dark-400.transition.duration-300(:style="{backgroundColor: tempo.color ,width: `${(position[0]%4+1)*25}%`}")
        .py-2px.op-80.bg-dark-400.transition.duration-300(:style="{backgroundColor: tempo.color ,width: `${(position[1]+1)*25}%`}")
        .py-2px.op-80.bg-dark-400.transition.duration-300(:style="{backgroundColor: tempo.color ,width: `${(position[2])*25}%`}")

      .flex.p-0.text-center.font-mono.text-sm
        .flex-1  {{ position[0] }}/{{ limitMeasures }} measures 
        .flex-1 ({{(position[0]/16).toFixed(1)}}/{{ limitMeasures/16 }} parts)
        .flex-1  {{ (progress*100).toFixed(1) }}%
        .flex-1 {{ (position[0]/tempo.bpm).toFixed(1) }}/{{ (limitMeasures/tempo.bpm).toFixed(1) }} min

    chroma-keys(
      :chroma="globalScale.chroma"
      :pitch="globalScale.tonic")
      .p-0
         

    

</template>