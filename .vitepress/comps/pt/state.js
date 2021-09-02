import { useStorage } from '@vueuse/core'
import { reactive, computed } from 'vue'

export const state = reactive({
  show: {
    letters: useStorage('table-letters', true),
    bpm: useStorage('table-bpm', true),
    hz: useStorage('table-hz', true),
    len: useStorage('table-len', true),
  },
  middleA: useStorage('table-middleA', 440),
  tuning: 'equal',
  octave: {
    range: {
      bottom: useStorage('table-bottom', 1),
      top: useStorage('table-top', 4),
    },
    limit: {
      bottom: -6,
      top: 8,
    },
    list: computed(() => {
      let octaves = []
      for (
        let i = state.octave.range.top;
        i >= state.octave.range.bottom;
        i--
      ) {
        octaves.push(i)
      }
      return octaves
    }),
    inc: incOctave,
    dec: decOctave,
  },
})

function decOctave(top) {
  let pos = top ? 'top' : 'bottom'
  let other = top ? 'bottom' : 'top'

  if (top && state.octave.range[pos] <= state.octave.range[other]) return
  if (!top && state.octave.range[pos] <= state.octave.limit[pos]) return

  state.octave.range[pos]--
}

function incOctave(top) {
  let pos = top ? 'top' : 'bottom'
  let other = top ? 'bottom' : 'top'

  if (top && state.octave.range[pos] >= state.octave.limit[pos]) return
  if (!top && state.octave.range[pos] >= state.octave.range[other]) return

  state.octave.range[pos]++
}
