<script setup lang="ts">
import { useFFT } from './useFFT';

const props = defineProps({
  name: { default: 'main:fft', type: String }
})

const { FFT } = useFFT(props.name)
</script>

<template lang='pug'>
.flex.flex-col.gap-2.is-group.p-2.bg-light-200.dark-bg-dark-200.shadow.rounded.gap-4
  svg.max-h-30(ref="svgElem" :viewBox="`0 0 ${100*Math.log2(FFT?.data[0].length+1) } 100`")
    g(v-for="(val,v) in FFT?.total" :key="v" )
      rect(
        :fill="FFT.colors[v]"
        :x="100*Math.log2(v+1)" 
        :y="98 -val*10"
        :width="100*(Math.log2(v+2)-Math.log2(v+1))"  
        rx="10"
        :height="200")
    
</template>