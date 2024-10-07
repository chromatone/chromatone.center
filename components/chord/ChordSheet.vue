<script setup>
import { chromaColorMix, pitchColor, rotateArray } from '#/use';
import { useData } from 'vitepress';
import { computed, ref } from 'vue';
import { Chord } from "tonal";
import { noteNames } from '#/use/theory'

const { isDark } = useData()

const props = defineProps({
  chord: { type: String, default: 'A' }
})

const emit = defineEmits(['reset'])

const data = computed(() => Chord.get(props.chord))
const steps = computed(() => Chord.steps(props.chord))
const pitch = computed(() => noteNames[data.value.tonic])

const sheet = ref()

const instrument = ref('ukulele')

const color = computed(() => chromaColorMix(rotateArray(data.value.chroma.split(''), -pitch.value).join(''), pitch.value, 0.3, isDark.value ? 4 : 12))

</script>

<template lang="pug">
transition(name="slide")
  .flex.flex-wrap.p-2.gap-2.rounded-3xl.shadow-xl.backdrop-blur.bg-light-200.bg-op-80.dark-bg-dark-200.dark-bg-op-80(
    ref="sheet"
    v-if="!data.empty")
    .flex.flex-col.gap-1.sticky.top-0(style="flex: 2 1 150px")
      .flex.flex-wrap.gap-2.items-baseline.p-1
        .sm-text-xl.rounded-lg.p-1.font-bold(:style="{ backgroundColor: pitchColor(pitch, 3, 1, 0.6) }") {{ chord }}
        .sm-text-xl.p-1.rounded-lg(:style="{ backgroundColor: color.hsl }") {{ data.name }}
        .flex-1 
        button.text-button.top-2.right-4(@click="emit('reset')")
          .i-la-angle-down
      .flex.flex-wrap.gap-2
        .p-1 Intervals:
        .p-1(v-for="interval in data.intervals" :key="interval") {{ interval }}
      chroma-keys(
        :chroma="data.chroma" 
        :pitch="pitch")
    chord-tab.max-h-50vh.cursor-pointer(
      style="flex: 1 1 120px"
      @click="instrument == 'ukulele' ? instrument = 'guitar' : instrument = 'ukulele'"
      :chroma="data.chroma" 
      :pitch="pitch" :instrument)

</template>