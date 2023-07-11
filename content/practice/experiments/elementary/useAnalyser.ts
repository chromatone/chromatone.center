import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useAudio } from './useAudio'

export function useAnalyser(name = 'osc') {

  const analyser = reactive({
    initiated: false,
    data: [0, 0],
    points: computed(() => analyser.data.map((v: number, i: number) => [i, v * 25].join(',')).join(' ')),
    async init() {
      const audio = useAudio()

      audio.core.on('scope', (e) => {
        if (e?.source == name) {
          let arr = [...e?.data[0].values()]
          // let zeroCross = arr.findIndex((v, i) => v * arr[i + 1] < 0)
          analyser.data = arr //.slice(zeroCross)
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