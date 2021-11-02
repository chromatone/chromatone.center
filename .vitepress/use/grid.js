import { tempo } from '@use/tempo.js'
import {
  Sequence,
  PanVol,
  gainToDb,
  Draw,
  PolySynth,
  context,
  start,
  Midi,
} from 'tone'
import { createAndDownloadBlobFile, midiOnce } from './midi'

export const loops = useStorage('tempo-bar-loops', [
  {
    over: 8,
    under: 8,
    tonic: 69,
    volume: 1,
    sound: 'A',
  },
  {
    over: 3,
    under: 3,
    tonic: 69,
    volume: 0.5,
    sound: 'B',
  },
])

export function addLoop() {
  loops.value.push({
    over: 4,
    under: 4,
    tonic: 69,
    volume: 1,
    sound: 'A',
  })
}

const tracks = reactive([])

export function useGrid(
  metre = {
    over: 4,
    under: 4,
    tonic: 69,
    sound: 'A',
    volume: 1,
  },
  order = 0,
) {
  let pan = order % 2 == 1 ? -0.5 : 0.5
  const panner = new PanVol(pan, 0).toDestination()
  const synth = new PolySynth({
    envelope: {
      attack: 0.1,
      release: '8n',
    },
    filterEnvelope: {
      attack: 0.1,
    },
  }).connect(panner)

  const current = ref('0-0')
  const steps = useStorage(`grid-${order}-steps`, [])

  const volume = useStorage(`grid-vol-${order}`, metre.volume || 1)
  const panning = useStorage(`grid-pan-${order}`, pan)
  const probability = useStorage(`grid-probability-${order}`, 1)
  let sequence = new Sequence(
    (time, step) => {
      beatClick(step, time)
    },
    steps.value,
    metre.under + 'n',
  ).start(0)

  tracks[order] = reactive({
    metre: computed(() => metre),
    steps: steps.value,
  })

  function clearGrid() {
    steps.value.forEach((step, s) => {
      steps.value[s] = [{}]
    })
  }

  watch(
    () => metre.under,
    () => {
      sequence.stop().dispose()
      sequence = new Sequence(
        (time, step) => {
          beatClick(step, time)
        },
        steps.value,
        metre.under + 'n',
      ).start(0)
    },
  )

  watch(
    () => metre.over,
    () => {
      if (steps.value.length > metre.over) {
        steps.value.length = metre.over
      } else {
        for (let i = steps.value.length; i < metre.over; i++) {
          steps.value.push([{}])
        }
      }

      sequence.events = steps.value
    },
    { immediate: true },
  )

  watchEffect(() => {
    sequence.events = steps.value
  })

  watchEffect(() => {
    if (tempo.stopped) {
      current.value = null
    }
  })

  watchEffect(() => {
    sequence.probability = probability.value
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
    Draw.schedule(() => {
      // console.log(step)
      current.value = step
    }, time)

    let notes = Object.entries(step).map((entry) =>
      entry[1] ? Midi(Number(entry[0]) + metre.tonic) : null,
    )
    synth.triggerAttackRelease(notes, metre.under + 'n', time)
    // midiOnce(notes[order * 2] + 3, { time: '+' + time })
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
    volume,
    panning,
    probability,
    clearGrid,
  }
}

import { Writer, Track, NoteEvent } from 'midi-writer-js'

export function renderMidi() {
  let render = []
  tracks.forEach((track, t) => {
    let division = 512 / track.metre.under
    let midiTrack = new Track()
    midiTrack.setTempo(tempo.bpm)
    midiTrack.addInstrumentName('116')
    midiTrack.addTrackName('Chromatone beat ' + t)
    midiTrack.setTimeSignature(4, 4)
    track.steps.forEach((step, s) => {
      step.forEach((code) => {
        if (track.mutes[s] || track.mutes[code]) return
        let [beat, sub] = code.split('-').map(Number)
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
            velocity: track.accents[s] || track.accents[code] ? 100 : 64,
          }),
        )
      })
    })
    // midiTrack.addEvent(
    //   new NoteEvent({
    //     pitch: 0,
    //     duration: `T1`,
    //     startTick: division * (track.steps.length - 1),
    //     velocity: 1,
    //   })
    // )
    render[t] = midiTrack
  })

  var write = new Writer(render)
  let midiData = new Midi(write.buildFile())
  midiData.tracks.forEach((track, t) => {
    midiData.tracks[t].instrument.number = 119
  })
  console.log(midiData.tracks)
  createAndDownloadBlobFile(midiData.toArray(), 'Chromatone-beat')
}
