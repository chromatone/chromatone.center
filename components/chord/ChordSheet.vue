<script setup>
import { chromaColorMix, pitchColor, rotateArray } from '#/use';
import { globalChord } from '#/use/global'
import { onClickOutside } from '@vueuse/core';
import { useData } from 'vitepress';
import { computed, ref } from 'vue';

const { isDark } = useData()

const sheet = ref()
onClickOutside(sheet, () => globalChord.name = '')

const instrument = ref('ukulele')

const color = computed(() => chromaColorMix(rotateArray(globalChord.data.chroma.split(''), -globalChord.pitch).join(''), globalChord.pitch, 0.3, isDark.value ? 4 : 12))

</script>

<template lang="pug">
transition(name="fade")
  .fixed.bottom-4.right-4.mx-auto.flex.flex-col.p-2.rounded-lg.shadow.backdrop-blur.bg-light-200.bg-op-80.dark-bg-dark-200.dark-bg-op-80.w-auto.max-w-90vw.min-w-80(
    ref="sheet"
    v-if="!globalChord.data.empty")
    .flex
      .p-1.w-20() 
      .p-1.rounded-xl.w-30() 
    button.absolute.top-2.right-2(@click="globalChord.name = ''")
      .i-la-times
    .flex.flex-wrap.gap-2.items-baseline.p-1
      .text-xl.rounded-lg.p-1.font-bold(:style="{ backgroundColor: pitchColor(globalChord.pitch, 3, 1, 0.6) }") {{ globalChord.name }}
      .text-xl.p-1.rounded-lg(:style="{ backgroundColor: color.hsl }") {{ globalChord.data.name }}
    .flex.flex-wrap.gap-2
      .p-1 Intervals:
      .p-1(v-for="interval in globalChord.data.intervals" :key="interval") {{ interval }}
    chroma-keys(
      :chroma="globalChord.data.chroma" 
      :pitch="globalChord.pitch")
    chord-tab.max-h-50vh.cursor-pointer(
      @click="instrument == 'ukulele' ? instrument = 'guitar' : instrument = 'ukulele'"
      :chroma="globalChord.data.chroma" 
      :pitch="globalChord.pitch" :instrument)

</template>