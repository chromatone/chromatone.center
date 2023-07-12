<script setup lang="ts">
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useAudio } from './useAudio'
import { Analyser } from 'tone';
import { relay } from '@gun-vue/composables';

const props = defineProps({
  name: { default: 'fft', type: String }
})

function useFFT(name = 'fft') {

  const FFT = reactive({
    initiated: false,
    data: [[], []],
    total: computed(() => FFT.data[0].map((val, v) => Math.log2(1 + Math.abs(val) + Math.abs(FFT.data[1][v])))),
    async init() {
      const audio = useAudio()

      audio.core.on('fft', e => {
        if (e?.source == name) {
          FFT.data[0] = [...e?.data.real.values()]
          FFT.data[1] = [...e?.data.imag.values()]
          // let zeroCross = arr.findIndex((v, i) => v * arr[i + 1] < 0)
        }
      })
    }
  })

  if (!FFT.initiated) {
    FFT.init()
    FFT.initiated = true
  }
  return FFT
}

const FFT = useFFT(props.name)
</script>

<template lang='pug'>
svg.max-h-30(ref="svgElem" :viewBox="`0 0 ${100*Math.log2(FFT?.data[0].length+1)} 100`")
  g
    rect(
      fill="currentColor"
      v-for="(val,v) in FFT?.total" :key="v" 
      :x="100*Math.log2(v+1)" 
      :y="98 -val*10"
      :width="100*(Math.log2(v+2)-Math.log2(v+1))"  
      rx="10"
      :height="200")
    
</template>