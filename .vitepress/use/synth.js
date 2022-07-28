import { PolySynth, MonoSynth, start, now, Midi, AutoPanner, Reverb, gainToDb, StereoWidener, PingPongDelay, Compressor, Gain } from 'tone'
import { midi } from './midi'
import { useCycleList } from '@vueuse/core'
import { onKeyDown } from '@vueuse/core'
import { createChannel } from './audio'


export const quantizeModes = ['+0', '@8n', '@16n', '@32n']


export const synth = {
  state: reactive({
    midi: useStorage('synth-midi', true),
    initiated: false,
    mute: false,
    quantize: useCycleList(quantizeModes, { initialValue: '+0' }),
    volume: useClamp(1, 0, 2)
  }),
  params: reactive({
    maxPolyphony: 50,
    oscillator: {
      type: useStorage('synth-osc', 'sawtooth8'),
    },
    volume: -30,
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.6,
      release: 1,
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.7,
      sustain: 0.5,
      release: 1,
      baseFrequency: 60,
      octaves: 5
    }
  }),
}

export function useSynth() {
  if (!synth.state.initiated) {

    onKeyDown('Escape', () => {
      synthReleaseAll()
    })

    watch(() => synth.state.volume, vol => synth.poly && synth.poly.volume.rampTo(gainToDb(vol)))

    watch(synth.params, params => {
      if (synth.poly) {
        synth.poly.set(params)
      }
    }, { deep: true, immediate: true })


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
  const { channel } = createChannel('synth')

  synth.widener = new StereoWidener(0.7).connect(channel)

  synth.reverb = new Reverb(3).connect(synth.widener)
  synth.delay = new PingPongDelay({ delayTime: '16n', feedback: 0.3, wet: 0.3, maxDelay: '4n' }).connect(synth.widener)

  synth.pan = new AutoPanner({ frequency: '4n', depth: 0.4 }).connect(synth.reverb).connect(synth.delay).connect(synth.widener)
  synth.compressor = new Compressor().connect(synth.pan)
  synth.poly = new PolySynth(MonoSynth, synth.params).connect(synth.compressor)

  synth.pan.start()
}

export function synthOnce(note = 'A4', duration = '8n', time) {
  if (!synth.poly || synth.state.mute) return init()
  synth.poly.triggerAttackRelease(note, duration, time)
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


