import { tempo } from '@use/tempo.js'
import { Sequence, Panner, Draw, Sampler, context, start } from 'tone'
import { reactive, ref, watchEffect, computed, onBeforeUnmount } from 'vue'

export function useSequence(metre = { over: 4, under: 4 }, order = 0) {
  const panner = new Panner(order % 2 == 0 ? -0.5 : 0.5).toDestination()
  const synth = new Sampler({
    urls: {
      A1: 'low.wav',
      A2: 'high.wav',
    },
    volume: -2,
    baseUrl: '/audio/metronome/SeikoSQ50/',
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
    metre.under + 'n',
  ).start(0)

  watchEffect(() => {
    steps.length = 0
    for (let i = 1; i <= metre.over; i++) {
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
    if (metre.mute) return
    if (mutes[step]) return
    if (step == 1) {
      synth.triggerAttackRelease('A1', '16n', time)
    } else {
      synth.triggerAttackRelease('A2', '16n', time)
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
