import { computed, reactive, watch, onBeforeUnmount, onMounted } from 'vue'
import { PolySynth, Frequency, DuoSynth } from 'tone'
import { useStorage } from '@vueuse/core'

const synth = {}

export const mute = useStorage('mute', false)

export function useSynth() {
  onMounted(() => {
    synth.poly = new PolySynth(DuoSynth, {
      maxPolyphony: 12,
      harmonicity: 1,
      volume: -17,
      voice1: {
        envelope: {
          attack: 0.1,
          decay: 0.8,
          sustain: 1,
          release: 4,
        },
      },
      voice2: {
        envelope: {
          attack: 0.1,
          decay: 1.6,
          sustain: 1,
          release: 2,
        },
      },
    }).toDestination()
  })

  function playOnce(note = 'A4', duration = '8n', time) {
    if (mute.value) return
    synth.poly.triggerAttackRelease(note, duration, time)
  }

  function attack(note) {
    if (mute.value) return
    synth.poly.triggerAttack(note)
  }

  function release(note) {
    if (mute.value) return
    synth.poly.triggerRelease(note)
  }

  return { synth, playOnce, attack, release }
}
