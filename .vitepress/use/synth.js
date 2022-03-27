import { PolySynth, MonoSynth, start, now, Midi } from 'tone'
import { midi } from './midi'
import { useStorage } from '@vueuse/core'

const synth = {}

export const synthOptions = reactive({
  midi: useStorage('midi-synth', false),
  initiated: false,
  params: {
    maxPolyphony: 50,
    oscillator: {
      type: useStorage('synth-osc', 'sawtooth8')
    },
    volume: -10,
    envelope: {
      attack: 0.02,
      decay: 2,
      sustain: 1,
      release: 4,
    },
    filterEnvelope: {
      attack: 0.1,
      decay: 2,
      sustain: 1,
      release: 4,
    },
  }

})

export function useSynth() {
  if (!synthOptions.initiated) {
    watch(() => synthOptions.params, params => {
      if (synth.poly) {
        synth.poly.set(params)
      }
    }, { deep: true })


    watch(() => midi.note, note => {
      if (!synthOptions.midi) return
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
  return { init, synth, synthOptions, synthOnce, synthAttack, synthRelease, synthReleaseAll }
}

export function init() {
  start()
  if (synth?.poly) return
  synth.poly = new PolySynth(MonoSynth, synthOptions.params).toDestination()
  synthOptions.initiated = true
}

export function synthOnce(note = 'A4', duration = '8n', time) {
  if (!synth.poly || synthOptions.mute) return init()
  synth.poly.triggerAttackRelease(note, duration, time)
}

export function synthAttack(note, velocity) {
  if (!synth.poly || synthOptions.mute) return init()
  synth.poly.triggerAttack(note, now(), velocity)
}

export function synthRelease(note) {
  if (!synth.poly || synthOptions.mute) return init()
  synth.poly.triggerRelease(note)
}

export function synthReleaseAll() {
  if (!synth.poly || synthOptions.mute) return init()
  synth.poly.releaseAll()
}


