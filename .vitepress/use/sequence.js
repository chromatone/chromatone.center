import { tempo } from '@use/tempo.js'
import { Sequence, PanVol, gainToDb, Draw, Sampler, context, start } from 'tone'

export function useSequence(
  metre = {
    over: 4,
    under: 4,
    sound: 'A',
    volume: 1,
  },
  order = 0,
  mode = 'bar',
) {
  let pan = order % 2 == 1 ? -0.5 : 0.5
  const panner = new PanVol(pan, 0).toDestination()
  const synth = new Sampler({
    urls: {
      A1: 'tongue/high.wav',
      A2: 'tongue/low.wav',
      B1: 'synth/high.wav',
      B2: 'synth/low.wav',
      C1: 'seiko/high.wav',
      C2: 'seiko/low.wav',
      D1: '/logic/high.wav',
      D2: '/logic/low.wav',
      E1: '/ping/high.wav',
      E2: '/ping/low.wav',
    },
    volume: 0,
    baseUrl: '/audio/metronome/',
  }).connect(panner)

  const current = ref('0-0')
  const steps = reactive([['0-1'], ['1-1'], ['2-1'], ['3-1']])
  const mutes = useStorage(
    `metro-${mode}-${metre.over / metre.under}-mutes-${order}`,
    [],
  )
  const accents = useStorage(
    `metro-${mode}-${metre.over / metre.under}-accents-${order}`,
    [true],
  )
  const volume = useStorage(`metro-${mode}-vol-${order}`, metre.volume || 1)
  const panning = useStorage(`metro-${mode}-pan-${order}`, pan)
  let sequence = new Sequence(
    (time, step) => {
      beatClick(step, time)
    },
    steps,
    metre.under + 'n',
  ).start(0)

  watch(
    () => metre.under,
    () => {
      sequence.stop().dispose()
      sequence = new Sequence(
        (time, step) => {
          beatClick(step, time)
        },
        steps,
        metre.under + 'n',
      ).start(0)
    },
  )

  watch(
    () => metre.over,
    () => {
      steps.length = 0
      for (let i = 0; i < metre.over; i++) {
        steps.push([`${i}-1`])
      }
      sequence.events = steps
    },
    { immediate: true },
  )

  watchEffect(() => {
    sequence.events = steps
    accents.value.length = steps.length
    mutes.value.length = steps.length
  })

  watchEffect(() => {
    if (tempo.stopped) {
      current.value = '0-1'
    }
  })

  watch(
    volume,
    (vol) => {
      panner.volume.targetRampTo(gainToDb(vol), 1)
    },
    { immediate: true },
  )

  watch(
    panning,
    (p) => {
      panner.pan.targetRampTo(p, 1)
    },
    { immediate: true },
  )

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
    let mainStep = typeof step == 'string' ? +step.split('-')[0] : step
    Draw.schedule(() => {
      current.value = step
    }, time)
    if (mutes.value[mainStep]) return
    if (mutes.value[step]) return
    if (accents.value[mainStep] && step.split('-')[1] == '1') {
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
    accents,
    volume,
    panning,
  }
}
