import { computed, reactive } from 'vue'
import { freqColor } from '#/use';
import { useElementary } from './useElementary';

export function useFFT(name = 'main:fft') {

  const { FFTs, meters } = useElementary()

  const FFT = reactive({
    sr: computed(() => meters['main:sample-rate']?.max || 44100),
    freq: computed(() => FFT.data[0].map((val, v) => v * FFT.sr / (FFT.data[0].length || 1))),
    colors: computed(() => FFT.freq.map(f => freqColor(f))),
    data: computed(() => FFTs?.[name] || [[], []]),
    total: computed(() => FFT.data[0].map((val, v) => Math.log2(1 + Math.abs(val) + Math.abs(FFT.data[1][v])))),
  })

  return { FFT }
}