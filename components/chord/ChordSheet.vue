<script setup>
import { chromaColorMix, pitchColor, rotateArray } from '#/use';
import { globalChord } from '#/use/global'
import { onClickOutside } from '@vueuse/core';
import { useData } from 'vitepress';
import { computed, ref } from 'vue';

const { isDark } = useData()

const sheet = ref()
// onClickOutside(sheet, () => globalChord.name = '')

const instrument = ref('ukulele')

const color = computed(() => chromaColorMix(rotateArray(globalChord.data.chroma.split(''), -globalChord.pitch).join(''), globalChord.pitch, 0.3, isDark.value ? 4 : 12))

</script>

<template lang="pug">
transition(name="slide")
  .flex.flex-wrap.p-2.gap-2.rounded-3xl.shadow-xl.backdrop-blur.bg-light-200.bg-op-80.dark-bg-dark-200.dark-bg-op-80(
    ref="sheet"
    v-if="!globalChord.data.empty")
    .flex.flex-col.gap-1.sticky.top-0(style="flex: 2 1 150px")
      .flex.flex-wrap.gap-2.items-baseline.p-1
        .sm-text-xl.rounded-lg.p-1.font-bold(:style="{ backgroundColor: pitchColor(globalChord.pitch, 3, 1, 0.6) }") {{ globalChord.name }}
        .sm-text-xl.p-1.rounded-lg(:style="{ backgroundColor: color.hsl }") {{ globalChord.data.name }}
        .flex-1 
        button.text-button.top-2.right-4(@click="globalChord.name = ''")
          .i-la-angle-down
      .flex.flex-wrap.gap-2
        .p-1 Intervals:
        .p-1(v-for="interval in globalChord.data.intervals" :key="interval") {{ interval }}
      chroma-keys(
        :chroma="globalChord.data.chroma" 
        :pitch="globalChord.pitch")
    chord-tab.max-h-50vh.cursor-pointer(
      style="flex: 1 1 120px"
      @click="instrument == 'ukulele' ? instrument = 'guitar' : instrument = 'ukulele'"
      :chroma="globalChord.data.chroma" 
      :pitch="globalChord.pitch" :instrument)

</template>