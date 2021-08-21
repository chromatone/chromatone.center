import { onMounted, watchEffect } from 'vue'
import { PolySynth, MonoSynth, getDestination, start, now } from 'tone'
import { useStorage } from '@vueuse/core'

export const mute = useStorage('mute', false)

watchEffect(() => {
  getDestination().mute = mute.value
})

const synth = {}

export function useSynth() {
  return { init, synth, synthOnce, synthAttack, synthRelease, synthReleaseAll }
}

export function init() {
  start()
  if (synth?.poly) return
  synth.poly = new PolySynth(MonoSynth, {
    maxPolyphony: 12,
    oscillator: {
      type: 'fatsawtooth',
    },
    volume: -10,
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 1,
      release: 2,
    },
  }).toDestination()
}

export function synthOnce(note = 'A4', duration = '8n', time) {
  if (!synth.poly || mute.value) return init()
  synth.poly.triggerAttackRelease(note, duration, time)
}

export function synthAttack(note, velocity) {
  if (!synth.poly || mute.value) return init()
  synth.poly.triggerAttack(note, now(), velocity)
}

export function synthRelease(note) {
  if (!synth.poly || mute.value) return init()
  synth.poly.triggerRelease(note)
}

export function synthReleaseAll() {
  if (!synth.poly || mute.value) return init()
  synth.poly.releaseAll()
}
