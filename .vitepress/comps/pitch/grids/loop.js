import { tempo } from '@use/tempo.js'
import { globalScale, rotateArray } from '@use/theory'
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
import { createAndDownloadBlobFile, midiOnce } from '@use/midi'

const tracks = reactive([])

export function useLoop(order = 0) {
  const loop = reactive({
    over: useStorage(`grid-${order}-over`, 4),
    under: useStorage(`grid-${order}-under`, 4),
    probability: useStorage(`grid-${order}-probability`, 1),
    pitch: computed(() => globalScale.tonic),
    chroma: computed(() => globalScale.set.chroma),
    octave: useStorage(`grid-${order}-octave`, 3),
    volume: useStorage(`grid-${order}-vol`, 1),
    pan: useStorage(`grid-${order}-pan`, order % 2 == 1 ? -0.5 : 0.5),
    tonic: computed(() => {
      return loop.pitch + 12 * loop.octave - 3
    }),
    steps: useStorage(`grid-${order}-steps`, []),
    current: [],
    progress: computed(() => {
      if (tempo.ticks) {
        return sequence?.progress
      } else {
        return 0
      }
    }),
    clear() {
      loop.steps.forEach((step, s) => {
        loop.steps[s] = [{}]
      })
    },
    rotate(way = 1) {
      loop.steps = rotateArray(loop.steps, way)
    },
  })

  const panner = new PanVol(loop.pan, 0).toDestination()
  const synth = new PolySynth({
    envelope: {
      attack: 0.5,
      release: 0.2,
    },
    filterEnvelope: {
      attack: 0.1,
      release: 0.2,
    },
  }).connect(panner)

  synth.maxPolyphony = 100

  let sequence = new Sequence(
    (time, step) => {
      beatClick(step, time)
    },
    loop.steps,
    loop.under + 'n',
  ).start(0)

  tracks[order] = reactive({
    loop: computed(() => loop),
  })

  watch(
    () => loop.under,
    () => {
      sequence.stop().dispose()
      sequence = new Sequence(
        (time, step) => {
          beatClick(step, time)
        },
        loop.steps,
        loop.under + 'n',
      ).start(0)
      sequence.probability = loop.probability
    },
  )

  watch(
    () => loop.over,
    () => {
      if (loop.steps.length > loop.over) {
        loop.steps.length = loop.over
      } else {
        for (let i = loop.steps.length; i < loop.over; i++) {
          loop.steps.push([{}])
        }
      }
      sequence.events = loop.steps
    },
    { immediate: true },
  )

  watchEffect(() => {
    sequence.events = loop.steps
  })

  watchEffect(() => {
    if (tempo.stopped) {
      loop.current = null
    }
  })

  watchEffect(() => {
    sequence.probability = loop.probability
    panner.volume.targetRampTo(gainToDb(loop.volume), 1)
    panner.pan.targetRampTo(loop.pan, 1)
  })

  function beatClick(step, time) {
    if (context.state == 'suspended') {
      start()
    }
    Draw.schedule(() => {
      // console.log(step)
      loop.current = step
    }, time)

    let notes = Object.entries(step).map((entry) => {
      if (entry[0] == 'sub') return
      return entry[1] ? Midi(Number(entry[0]) + loop.tonic) : null
    })
    synth.triggerAttackRelease(
      notes,
      { [loop.under + 'n']: 1 / (step.sub || 1) },
      time,
    )
    // midiOnce(notes[order * 2] + 3, { time: '+' + time })
  }

  onBeforeUnmount(() => {
    sequence.stop().dispose()
    panner.dispose()
    synth.dispose()
  })

  return loop
}

import { Writer, Track, NoteEvent } from 'midi-writer-js'

export function renderMidi() {
  let render = []
  tracks.forEach((track, t) => {
    let division = 512 / track.loop.under
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
