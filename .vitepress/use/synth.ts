/**
 * @module Synth
 */

import { PolySynth, MonoSynth, start, Midi, AutoPanner, Reverb, gainToDb, StereoWidener, PingPongDelay, Compressor, Delay } from 'tone'
import { midi } from './midi'
import { useCycleList } from '@vueuse/core'
import { onKeyDown } from '@vueuse/core'
import { createChannel } from './audio'
import { reactive, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { useClamp } from '@vueuse/math'

export const quantizeModes = ['+0', '@8n', '@16n', '@32n']

export const synth: {
  state: any
  params: any
  poly: PolySynth
  widener: StereoWidener
  delay: Delay
  reverb: Reverb
  pan: AutoPanner
  compressor: Compressor
} = {
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
  poly: null,
  widener: null,
  delay: null,
  reverb: null,
  pan: null,
  compressor: null
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
      if (!synth?.state?.midi) return
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
  return { init: synthInit, synth, once: synthOnce, attack: synthAttack, release: synthRelease, releaseAll: synthReleaseAll }
}

export function synthInit() {
  start()
  if (synth?.poly) return
  const channel = createChannel('synth')

  synth.widener = new StereoWidener(0.7).connect(channel)

  synth.reverb = new Reverb(3).connect(synth.widener)
  //@ts-expect-error
  synth.delay = new PingPongDelay({ delayTime: '16n', feedback: 0.3, wet: 0.3, maxDelay: '4n' }).connect(synth.widener)

  synth.pan = new AutoPanner({ frequency: '4n', depth: 0.4 }).connect(synth.reverb).connect(synth.delay).connect(synth.widener)
  synth.compressor = new Compressor().connect(synth.pan)
  synth.poly = new PolySynth(MonoSynth, synth.params).connect(synth.compressor)

  synth.pan.start()
}

export function synthOnce(note: string | number | string[], duration: string | number, time?: string | number) {
  if (!synth.poly || synth.state.mute) return synthInit()
  console.log(note, duration)
  synth.poly.triggerAttackRelease(note || 'A4', duration, 0)
}

export function synthAttack(note: string | number | string[], velocity?: number) {
  if (!synth.poly || synth.state.mute) return synthInit()
  synth.poly.triggerAttack(note, synth.state.quantize.state, velocity)
}

export function synthRelease(note) {
  if (!synth.poly || synth.state.mute) return synthInit()
  synth.poly.triggerRelease(note, synth.state.quantize.state)
}

export function synthReleaseAll() {
  if (!synth.poly || synth.state.mute) return synthInit()
  synth.poly.releaseAll()
}


