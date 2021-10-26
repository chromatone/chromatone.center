import { tempo } from '@use/tempo.js'
import { Sequence, PanVol, gainToDb, Draw, Sampler, context, start } from 'tone'
import { createAndDownloadBlobFile, midiOnce } from './midi'

const tracks = reactive([])

let notes = ['C', 'E', 'G', 'B', 'D', 'F', 'A', 'C#', 'D#', 'F#', 'G#', 'A#']

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

  tracks[order] = reactive({
    metre: computed(() => metre),
    steps,
    mutes,
    accents,
  })

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
      current.value = '1000-1'
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
      // midiOnce(notes[order * 2] + 3, { time: '+' + time })
    } else {
      synth.triggerAttackRelease(`${metre.sound}2`, '16n', time)
      // midiOnce(notes[order * 2 + 1] + 3, { time: '+' + time })
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

import { Writer, Track, NoteEvent } from 'midi-writer-js'
import { Midi } from '@tonejs/midi'

export function renderMidi() {
  let render = []
  tracks.forEach((track, t) => {
    let midiTrack = new Track()
    midiTrack.setTempo(tempo.bpm)
    midiTrack.addInstrumentName('Clave')
    midiTrack.addTrackName('Chromatone beat ' + t)
    track.steps.forEach((step, s) => {
      step.forEach((code) => {
        if (track.mutes[s] || track.mutes[code]) return
        let [beat, sub] = code.split('-').map(Number)
        let division = 512 / track.metre.under
        let subdivision = division / step.length
        let subStep = 0
        if (step.length > 1) {
          subStep = sub * subdivision
        }
        midiTrack.addEvent(
          new NoteEvent({
            pitch: track.accents[s]
              ? notes[t * 2] + '2'
              : notes[t * 2 + 1] + '2',
            duration: `T${subdivision}`,
            startTick: division * beat + subStep,
            repeat: 2,
            velocity: track.accents[s] || track.accents[code] ? 100 : 64,
          }),
        )
      })
    })
    render[t] = midiTrack
  })

  var write = new Writer(render)
  let midiData = new Midi(write.buildFile())
  createAndDownloadBlobFile(midiData.toArray(), 'Chromatone-beat')
}
