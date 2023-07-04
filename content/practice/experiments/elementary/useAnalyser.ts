import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useAudio } from './useAudio'

const analyser = reactive({
  initiated: false,
  osc: [0, 0],
  oscPoints: computed(() => analyser.osc.map((v: number, i: number) => [i, v * 25].join(',')).join(' ')),
  async init() {
    const audio = useAudio()

    audio.core.on('scope', (e) => {
      if (e?.source == 'osc') {
        let arr = [...e?.data[0].values()]
        // let zeroCross = arr.findIndex((v, i) => v * arr[i + 1] < 0)
        analyser.osc = arr //.slice(zeroCross)
      }
    })
  }
})

export function useAnalyser() {
  if (!analyser.initiated) {
    analyser.init()
    analyser.initiated = true
  }
  return analyser
}