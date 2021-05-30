import { onMounted } from 'vue'
import { PolySynth, AMSynth } from 'tone'

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

  return { synth, playOnce, attack, release }
}

export function playOnce(note = 'A4', duration = '8n', time) {
  if (!synth.poly) return
  synth.poly.triggerAttackRelease(note, duration, time)
}

export function attack(note) {
  if (!synth.poly) return
  synth.poly.triggerAttack(note)
}

export function release(note) {
  if (!synth.poly) return
  synth.poly.triggerRelease(note)
}
