<script setup>
import { computed, ref } from 'vue'
import { globalScale, tempo } from '#/use'
import { useClamp } from '@vueuse/math';
import { TransitionPresets, useTransition } from '@vueuse/core'
import { noteColor } from '#/use/colors'
import { colord } from 'colord';


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

const colorMix = computed(() => colord(tempo?.color).mix(noteColor(globalScale.tonic)).toHex())

</script>

<template lang="pug">
#screen.bg-light-900.dark-bg-dark-800
  .flex.flex-col.gap-0.p-4.justify-between.relative.items-stretch.min-h-100vh.transition.duration-1000(
  :style="{backgroundColor:`hsla(${30*globalScale.tonic}, 80%, 50%, 0.05)`}"
  )
    .text-4xl.text-center RANDOM JAM 
    .text-sm.text-center 
    .flex
      button.transition.duration-1000.text-4xl.bg-dark-400.text-white.p-4.rounded-full.shadow-xl.mx-auto(@click="randomize()" :style="{backgroundColor:colorMix}")
        .p-0(:class="{'animate-spin':spin}")
          .i-system-uicons-reset.-scale-y-100


    .flex.flex-col.gap-2.mx-auto.w-full
      .text-4xl.flex-1.border-b-4(:style="{borderColor: noteColor(globalScale.tonic)}") {{ globalScale.note.name }} {{ globalScale?.set?.name }}
    chroma-keys.max-h-40vh(
      :chroma="globalScale.chroma"
      :pitch="globalScale.tonic")

    .flex.flex-wrap.gap-4.text-center.relative.items-center.justify-stretch
      .flex.flex-col.gap-2.w-full
        .text-4xl.flex-1.tabular-nums.border-b-4(:style="{borderColor: tempo.color}") {{ output.toFixed() }} BPM
        .flex.flex-col.gap-2.w-full
          .flex.gap-2.w-full
            .p-1.flex-1.transition.ease-in-out.rounded-lg(v-for="i in 4" :style="{backgroundColor: i-1 ==position[1] ? tempo.color : 'transparent' }")

          .flex.gap-2.w-full
            .p-2.flex-1.transition.ease-in-out.rounded-lg(v-for="i in 4" :style="{backgroundColor: i-1 ==position[0]%4 ? tempo.color : 'transparent' }")

          .flex.gap-2.w-full
            .p-3.flex-1.transition.ease-in-out.rounded-lg(v-for="i in 4" :style="{backgroundColor: i-1 ==(Math.floor(position[0]/4))%4 ? tempo.color : 'transparent' }")

          .flex.gap-2.w-full
            .p-4.flex-1.transition.ease-in-out.rounded-lg(v-for="i in 4" :style="{backgroundColor: i-1 ==(Math.floor(position[0]/4/4))%4 ? tempo.color : 'transparent' }")

          .flex.gap-2.w-full
            .p-5.flex-1.transition.ease-in-out.rounded-lg(v-for="i in 4" :style="{backgroundColor: i-1 ==(Math.floor(position[0]/4/4/4))%4 ? tempo.color : 'transparent' }")

          .flex.gap-2.w-full
            .p-6.flex-1.transition.ease-in-out.rounded-lg(v-for="i in 4" :style="{backgroundColor: i-1 ==(Math.floor(position[0]/4/4/4/4))%4 ? tempo.color : 'transparent' }")

          .flex.gap-2.w-full
            .p-7.flex-1.transition.ease-in-out.rounded-lg(v-for="i in 4" :style="{backgroundColor: i-1 ==(Math.floor(position[0]/4/4/4/4/4))%4 ? tempo.color : 'transparent' }")

      .py-5.bg-dark-400.transition.duration-300.rounded-lg(:style="{backgroundColor: colorMix ,width: `${progress*100}%`}")
</template>