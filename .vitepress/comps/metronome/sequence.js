import { tempo } from '@use/tempo.js'
import { Sequence, PanVol, gainToDb, Draw, Sampler, context, start } from 'tone'
import { reactive, ref, watchEffect, computed, onBeforeUnmount } from 'vue'

export function useSequence(metre = { over: 4, under: 4 }, order = 0) {
  let pan = order % 2 == 1 ? -0.5 : 0.5
  const panner = new PanVol(pan, 0).toDestination()
  const synth = new Sampler({
    urls: {
      A1: 'block/low.wav',
      B1: 'block/high.wav',
      A2: 'synth/low.wav',
      B2: 'synth/high.wav',
      A3: 'block/high.wav',
      B3: 'block/low.wav',
    },
    volume: -2,
    baseUrl: '/audio/metronome/',
  }).connect(panner)

  const current = ref(0)
  const steps = reactive([1, 2, 3, 4])
  const mutes = reactive({})
  const volume = ref(1)
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

  watch(volume, (vol) => {
    panner.volume.targetRampTo(gainToDb(vol))
  })

  const progress = computed(() => {
    if (tempo.ticks) {
      // let pan = Math.sin(sequence.progress * Math.PI * 2)
      // panner.pan.linearRampTo(pan * 0.7, 0.1)
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
      synth.triggerAttackRelease(`A${order + 1}`, '16n', time)
    } else {
      synth.triggerAttackRelease(`B${order + 1}`, '16n', time)
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
    volume,
  }
}
