import { tempo } from '@use/tempo.js'
import { Sequence, PanVol, gainToDb, Draw, Sampler, context, start } from 'tone'
import { reactive, ref, watchEffect, computed, onBeforeUnmount } from 'vue'

export function useSequence(
  metre = { over: 4, under: 4, sound: 'A' },
  order = 0,
) {
  let pan = order % 2 == 1 ? -0.5 : 0.5
  const panner = new PanVol(pan, 0).toDestination()
  const synth = new Sampler({
    urls: {
      A1: 'tongue/low.wav',
      A2: 'tongue/high.wav',
      B1: 'synth/low.wav',
      B2: 'synth/high.wav',
      C1: 'seiko/high.wav',
      C2: 'seiko/low.wav',
      D1: '/logic/high.wav',
      D2: '/logic/low.wav',
      E1: '/ping/high.wav',
      E2: '/ping/low.wav',
    },
    volume: -2,
    baseUrl: '/audio/metronome/',
  }).connect(panner)

  const current = ref(0)
  const steps = reactive([1, 2, 3, 4])
  const mutes = useStorage(`metro-mutes-${order}`, {})
  const volume = useStorage(`metro-vol-${order}`, 1)
  const panning = useStorage(`metro-pan-${order}`, pan)
  let sequence = new Sequence(
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
    sequence.stop().dispose()
    sequence = new Sequence(
      (time, step) => {
        Draw.schedule(() => {
          current.value = step
        }, time)
        beatClick(step, time)
      },
      steps,
      metre.under + 'n',
    ).start(0)
  })

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
    panner.volume.targetRampTo(gainToDb(vol), 1)
  })

  watch(panning, (p) => {
    panner.pan.targetRampTo(p, 1)
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
    console.log(step)
    if (mutes.value[step]) return
    if (step == 1) {
      synth.triggerAttackRelease(`${metre.sound}1`, '16n', time)
    } else {
      synth.triggerAttackRelease(`${metre.sound}2`, '16n', time)
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
    panning,
  }
}
