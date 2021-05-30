import { tempo } from '@use/tempo.js'
import { Sequence, Draw, PluckSynth, context, start } from 'tone'
import { mute } from '@use/synth.js'
import { reactive, ref, watchEffect, computed } from 'vue'

export function useSequence(size = '4n') {
  const synth = new PluckSynth({
    volume: -4,
  }).toDestination()

  const current = ref(0)
  const steps = reactive([1, 2, 3, 4])
  const measure = size.match(/(\d+)/)[0]
  const sequence = new Sequence(
    (time, step) => {
      Draw.schedule(() => {
        current.value = step
      }, time)
      beatClick(step, time)
    },
    steps,
    size,
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

  function beatClick(step, time) {
    if (context.state == 'suspended') {
      start()
    }
    if (mute.value) return
    if (step == 1) {
      synth.resonance = 0.95
      synth.triggerAttackRelease(tempo.tune, '16n', time)
    } else {
      synth.resonance = 0.85
      synth.triggerAttackRelease('G4', '16n', time)
    }
  }

  return {
    progress,
    current,
    steps,
    measure,
  }
}
