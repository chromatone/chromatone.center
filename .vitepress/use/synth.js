import { onMounted, watchEffect } from 'vue'
import { PolySynth, AMSynth, getDestination } from 'tone'
import { useStorage } from '@vueuse/core'

export const mute = useStorage('mute', false)

watchEffect(() => {
  getDestination().mute = mute.value
})

const synth = {}

export function useSynth() {
  onMounted(() => {
    if (synth?.poly) return
    synth.poly = new PolySynth(AMSynth, {
      maxPolyphony: 12,
      harmonicity: 1,
      volume: -5,
      envelope: {
        attack: 0.1,
        decay: 0.8,
        sustain: 1,
        release: 4,
      },
    }).toDestination()
  })

  return { synth, synthOnce, synthAttack, synthRelease }
}

export function synthOnce(note = 'A4', duration = '8n', time) {
  if (!synth.poly || mute.value) return
  synth.poly.triggerAttackRelease(note, duration, time)
}

export function synthAttack(note) {
  if (!synth.poly || mute.value) return
  synth.poly.triggerAttack(note)
}

export function synthRelease(note) {
  if (!synth.poly || mute.value) return
  synth.poly.triggerRelease(note)
}
