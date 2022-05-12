import { PolySynth, MonoSynth, start, now, Midi, AutoPanner, Reverb } from 'tone'
import { midi } from './midi'
import { useStorage, useCycleList } from '@vueuse/core'

export const quantizeModes = ['+0', '@8n', '@16n', '@32n']

export const synth = {
  state: reactive({
    midi: useStorage('synth-midi', true),
    initiated: false,
    mute: false,
    quantize: useCycleList(quantizeModes, { initialValue: useStorage('synth-quantize', quantizeModes[0]) }),
  }),
  params: reactive({
    maxPolyphony: 50,
    oscillator: {
      type: useStorage('synth-osc', 'sawtooth8')
    },
    volume: -10,
    envelope: {
      attack: 0.009,
      decay: 0.3,
      sustain: 0.4,
      release: 0.8,
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.7,
      sustain: 0.5,
      release: 1,
      baseFrequency: 60,
      octaves: 5
    }
  })
}

export function useSynth() {
  if (!synth.state.initiated) {

    watch(synth.params, params => {
      if (synth.poly) {
        synth.poly.set(params)
      }
    }, { deep: true })


    watch(() => midi.note, note => {
      if (!synth.state.midi) return
      if (note.velocity > 0) {
        synthAttack(Midi(note.number).toFrequency(), note.velocity / 127)
      } else {
        synthRelease(Midi(note.number).toFrequency())
      }
    })

    watch(() => midi.playing, play => {
      if (!play) synthReleaseAll()
    })
  }
  return { init, synth, synthOnce, synthAttack, synthRelease, synthReleaseAll }
}

export function init() {
  start()
  if (synth?.poly) return
  synth.pan = new AutoPanner({ frequency: '4n', depth: 0.4 }).toDestination()
  synth.reverb = new Reverb(2.5).connect(synth.pan)
  synth.poly = new PolySynth(MonoSynth, synth.params).connect(synth.pan)

  synth.reverb.wet.set(0.7)
  synth.poly.connect(synth.reverb)
  synth.poly.connect(synth.pan)
  synth.pan.start()
}

export function synthOnce(note = 'A4', duration = '8n', time) {
  if (!synth.poly || synth.state.mute) return init()
  synth.poly.triggerAttackRelease(note, duration, synth.state.quantize.state)
}

export function synthAttack(note, velocity) {
  if (!synth.poly || synth.state.mute) return init()
  synth.poly.triggerAttack(note, synth.state.quantize.state, velocity)
}

export function synthRelease(note) {
  if (!synth.poly || synth.state.mute) return init()
  synth.poly.triggerRelease(note, synth.state.quantize.state)
}

export function synthReleaseAll() {
  if (!synth.poly || synth.state.mute) return init()
  synth.poly.releaseAll()
}


