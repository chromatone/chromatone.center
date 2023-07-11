<script setup lang="ts">
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useAudio } from './useAudio'

const props = defineProps({
  name: { default: 'fft', type: String }
})

function useFFT(name = 'fft') {

  const analyser = reactive({
    initiated: false,
    data: [],
    points: computed(() => analyser.data.map((v, i) => [i, v])),
    async init() {
      const audio = useAudio()

      audio.core.on('fft', e => {
        if (e?.source == name) {
          let real = [...e?.data.real.values()]
          let imag = [...e?.data.imag.values()]
          // let zeroCross = arr.findIndex((v, i) => v * arr[i + 1] < 0)
          analyser.data = real.map((el, i) => {
            let mag = Math.log(Math.pow(el, 2) + Math.pow(imag[i], 2))
            return (mag)
          }) //.slice(zeroCross)
        }
      })
    }
  })

  if (!analyser.initiated) {
    analyser.init()
    analyser.initiated = true
  }
  return analyser
}

const FFT = useFFT(props.name)
</script>

<template lang='pug'>
svg.mix-blend-difference(ref="svgElem" v-show="FFT.data.length>2" :viewBox="`0 0 ${FFT.data.length} 100`")
  g(v-for="val in FFT.points" :key="val[0]")
    line(:x1="val[0]" :x2="val[0]" :y1="100" :y2="-val[1]*5" stroke="white")
</template>