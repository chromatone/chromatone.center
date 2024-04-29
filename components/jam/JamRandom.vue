<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { globalScale, tempo } from '#/use'
import { useClamp } from '@vueuse/math';
import { TransitionPresets, useTimestamp, useTransition } from '@vueuse/core'
import { noteColor } from '#/use/colors'
import { colord } from 'colord';
import { useData } from 'vitepress'
const { isDark } = useData()

var meanTempo = 102; // Среднее значение темпа
var stdDevTempo = 20; // Стандартное отклонение темпа

function randomNormalDistribution(mean, stdDev) {
  let u = 1 - Math.random()
  let v = 1 - Math.random()
  var normalDistribution = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + stdDev * normalDistribution;
}



const output = useTransition(() => tempo.bpm, {
  duration: 1000,
  transition: TransitionPresets.easeInOutCubic,
})

const spin = ref(false)
const startedAt = ref(Date.now())
const limitMeasures = useClamp(256, 64, 1024)

function randomize() {
  if (spin.value) return
  tempo.stopped = true

  spin.value = true
  tempo.bpm = Math.round(randomNormalDistribution(meanTempo, stdDevTempo));
  globalScale.chroma = Math.random() > .7 ? "101011010101" : "101101011010"
  globalScale.tonic = Math.round(Math.random() * 12)

  setTimeout(() => {
    spin.value = false;
    tempo.playing = true
    startedAt.value = Date.now()
  }, 1000)

}


const position = computed(() => tempo.position?.split(':').map(Number))

const progress = computed(() => position.value?.[0] / limitMeasures.value)

const tempoColor = computed(() => colord(tempo.color).lighten(!isDark.value ? .3 : 0).desaturate(0.2).toHex())

const tonicColor = computed(() => colord(noteColor(globalScale.tonic)).lighten(!isDark.value ? .3 : 0).desaturate(0.2).toHex())

const colorMix = computed(() => colord(tempoColor.value).mix(tonicColor.value).toHex())

const getMinutesSeconds = (decimalMinutes) => [Math.floor(decimalMinutes), Math.round((decimalMinutes - Math.floor(decimalMinutes)) * 60)];

const getMillisecondsFromMinutes = (decimalMinutes) => Math.round(decimalMinutes * 60 * 1000);



const duration = computed(() => getMinutesSeconds(limitMeasures.value * 4 / tempo.bpm))

const dist = computed(() => getMillisecondsFromMinutes(limitMeasures.value * 4 / tempo.bpm))

const finishAt = computed(() => startedAt.value + dist.value)

const now = useTimestamp()

const dur = computed(() => [Math.floor((now.value - startedAt.value) / (1000 * 60)), Math.round(((now.value - startedAt.value) % (1000 * 60)) / 1000)])

watch(now, n => {
  if (n > finishAt.value) {
    randomize()
  }
})

</script>

<template lang="pug">
#screen.bg-light-900.dark-bg-dark-800
  .flex.flex-col.gap-4.p-4.justify-between.relative.items-stretch.min-h-100vh.transition.duration-1000(
  :style="{backgroundColor:colord(colorMix).alpha(.3).toHex()}"
    )
    .text-4xl.text-center RANDOM JAM 

    .flex.items-center.justify-between.gap-2

      .text-center.text-2xl.sm-text-4xl.tabular-nums.rounded-full.px-4.py-2.shadow(
        style="flex: 1 1 140px"
        :style="{backgroundColor: tempoColor}"
        ) {{ output.toFixed() }} BPM
      button.transition.duration-1000.text-4xl.bg-dark-400.p-4.rounded-full.shadow-xl(@click="randomize()" :style="{backgroundColor:colorMix}")
        .p-0(:class="{'animate-spin':spin}")
          .i-system-uicons-reset.-scale-y-100
      .text-2xl.sm-text-4xl.text-center.rounded-full.px-4.py-2.shadow(
        style="flex: 1 1 140px"
        :style="{backgroundColor: tonicColor}"
        ) {{ globalScale.note.name }} {{ globalScale?.set?.name }}


    .overflow-clip.rounded-lg.flex.items-center.border-1.relative.border-dark-200.border-op-30.dark-border-light-200.dark-border-op-40.py-6
      .absolute.left-2.z-10 {{ new Date(startedAt).toTimeString().slice(0,5) }}
      .absolute.right-2.z-10 {{ new Date(finishAt).toTimeString().slice(0,5) }}

      .bg-dark-400.transition.duration-300.top-0.bottom-0.left-0.absolute.flex.items-center(:style="{backgroundColor: colorMix ,width: `${progress*100}%`}")
        .px-2.z-10.mx-auto.tabular-nums.absolute.-right-18.dark-bg-dark-200.text-right.text-nowrap.bg-light-300.rounded-xl.op-90() {{dur.join(' m ')}} s / {{ duration.join(' m ') }} s
    .flex.flex-wrap.gap-4.text-center.relative.items-center.justify-stretch.mb-8
      .flex.flex-col.gap-2.w-full.max-h-30vh
        .flex.flex-col.gap-2.w-full
          .flex.gap-2.w-full
            .p-1.bit(v-for="i in 4" :style="{backgroundColor: i-1 ==position[1] ? tempoColor : 'transparent' }")

          .flex.gap-2.w-full
            .p-2.bit(v-for="i in 4" :style="{backgroundColor: i-1 ==position[0]%4 ? tempoColor : 'transparent' }")

          .flex.gap-2.w-full
            .p-3.bit(v-for="i in 4" :style="{backgroundColor: i-1 ==(Math.floor(position[0]/4))%4 ? tempoColor : 'transparent' }")

          .flex.gap-2.w-full
            .p-4.bit(v-for="i in 4" :style="{backgroundColor: i-1 ==(Math.floor(position[0]/4/4))%4 ? tempoColor : 'transparent' }")
          .flex.gap-2.w-full

            .p-5.bit(v-for="i in 4" :style="{backgroundColor: i-1 ==(Math.floor(position[0]/4/4/4))%4 ? tempoColor : 'transparent' }")


    chroma-keys.max-h-35vh(
      :title="false"
      :chroma="globalScale.chroma"
      :pitch="globalScale.tonic")

    .flex-0




</template>

<style scoped lang="postcss">
.bit {
  @apply flex-1 transition ease-in-out rounded-lg border-1 border-dark-100 border-op-20 dark-border-light-900 dark-border-op-30
}
</style>