import { reactive, computed } from 'vue'

export const state = reactive({
  show: {
    letters: true,
    bpm: false,
    hz: false,
  },
  rootFreq: 440,
  tuning: 'equal',
  octave: {
    range: [1, 4],
    limit: [-6, 9],
    list: computed(() => {
      let octaves = []
      for (let i = state.octave.range[1]; i >= state.octave.range[0]; i--) {
        octaves.push(i)
      }
      return octaves
    }),
  },
})
