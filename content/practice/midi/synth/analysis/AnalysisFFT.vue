<script setup lang="ts">
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useAudio } from '../audio/useAudio'
import { freqColor } from '#/use';

const props = defineProps({
  name: { default: 'main:fft', type: String }
})

function useFFT(name = 'main:fft') {

  const { FFTs, meters } = useAudio()

  const FFT = reactive({
    sr: computed(() => meters['main:sample-rate']?.max || 44100),
    freq: computed(() => FFT.data[0].map((val, v) => v * FFT.sr / (FFT.data[0].length || 1))),
    colors: computed(() => FFT.freq.map(freqColor)),
    data: computed(() => FFTs?.[name]?.map(d => d.slice(0, d.length / 2)) || [[], []]),
    total: computed(() => FFT.data[0].map((val, v) => Math.log2(1 + Math.abs(val) + Math.abs(FFT.data[1][v])))),
  })

  return { FFT, meters }
}

const { FFT, meters } = useFFT(props.name)
</script>

<template lang='pug'>
.flex.flex-col.gap-2.is-group.p-2.bg-light-200.dark-bg-dark-200.shadow.rounded.gap-4
  svg.max-h-30(ref="svgElem" :viewBox="`0 0 ${100*Math.log2(FFT?.data[0].length+1)} 100`")
    g
      rect(
        :fill="FFT.colors[v]"
        v-for="(val,v) in FFT?.total" :key="v" 
        :x="100*Math.log2(v+1)" 
        :y="98 -val*10"
        :width="100*(Math.log2(v+2)-Math.log2(v+1))"  
        rx="10"
        :height="200")
    
</template>