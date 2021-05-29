import { tempo } from '@use/tempo.js'
import { Sequence, Draw } from 'tone'
import { reactive, ref, watchEffect, computed } from 'vue'

export function useSequencer() {
  const list = reactive([])
}

export function useSequence(beat) {
  const current = ref(0)
  const steps = reactive([1, 2, 3, 4])
  const sequence = new Sequence(
    (time, step) => {
      Draw.schedule(() => {
        current.value = step
      }, time)
      beat && beat(step, time)
    },
    steps,
    '4n',
  ).start(0)

  watchEffect(() => {
    steps.length = 0
    for (let i = 1; i <= tempo.metre.over; i++) {
      steps.push(i)
    }
    sequence.events = steps
  })

  watchEffect(() => {
    if (tempo.stopped) {
      current.value = 0
    }
  })

  const progress = computed(() => {
    if (tempo.ticks) {
      return sequence.progress
    } else {
      return 0
    }
  })

  return {
    progress,
    current,
    steps,
  }
}
