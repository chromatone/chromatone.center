import { computed, reactive, watch, onBeforeUnmount, onMounted } from 'vue'
import { PolySynth, Frequency, AMSynth } from 'tone'
import { useStorage } from '@vueuse/core'

const synth = {}

export const mute = useStorage('mute', false)

export function useSynth() {
  onMounted(() => {
    if (synth?.poly) return
    synth.poly = new PolySynth(AMSynth, {
      maxPolyphony: 12,
      harmonicity: 1,
      volume: -10,
      envelope: {
        attack: 0.1,
        decay: 0.8,
        sustain: 1,
        release: 4,
      },
    }).toDestination()
  })

  return { synth, playOnce, attack, release }
}

export function playOnce(note = 'A4', duration = '8n', time) {
  if (mute.value || !synth.poly) return
  synth.poly.triggerAttackRelease(note, duration, time)
}

export function attack(note) {
  if (mute.value || !synth.poly) return
  synth.poly.triggerAttack(note)
}

export function release(note) {
  if (mute.value || !synth.poly) return
  synth.poly.triggerRelease(note)
}
