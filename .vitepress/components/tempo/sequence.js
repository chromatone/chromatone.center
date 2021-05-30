import { tempo } from '@use/tempo.js'
import {
  Sequence,
  Panner,
  Draw,
  PluckSynth,
  context,
  start,
  Frequency,
} from 'tone'
import { mute } from '@use/synth.js'
import { reactive, ref, watchEffect, computed, onBeforeUnmount } from 'vue'

export function useSequence(size = { over: 4, under: 4 }, order = 0) {
  const panner = new Panner(order % 2 == 0 ? -0.5 : 0.5).toDestination()
  const synth = new PluckSynth({
    volume: -2,
  }).connect(panner)

  const current = ref(0)
  const steps = reactive([1, 2, 3, 4])
  const mutes = reactive({})
  const sequence = new Sequence(
    (time, step) => {
      Draw.schedule(() => {
        current.value = step
      }, time)
      beatClick(step, time)
    },
    steps,
    size.under + 'n',
  ).start(0)

  watchEffect(() => {
    steps.length = 0
    for (let i = 1; i <= size.over; i++) {
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
    if (mutes[step]) return
    if (step == 1) {
      synth.resonance = 0.9
      synth.triggerAttackRelease(
        order % 2 == 1 ? tempo.tune : Frequency(tempo.tune).transpose(-5),
        '16n',
        time,
      )
    } else {
      synth.resonance = 0.85
      synth.triggerAttackRelease(
        order % 2 == 1 ? Frequency(tempo.tune).transpose(7) : tempo.tune,
        '16n',
        time,
      )
    }
  }

  onBeforeUnmount(() => {
    sequence.stop().dispose()
    panner.dispose()
    synth.dispose()
  })

  return {
    progress,
    current,
    steps,
    mutes,
  }
}
