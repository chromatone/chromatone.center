import { el } from '@elemaudio/core';
import { ref, watch, reactive, watchEffect } from 'vue';

import params from './params.json'

import { useElementary } from '#/use/elementary/useElementary.js';
import { useParams } from '#/use/elementary/useParams.js';
import { useMidi, useTempo } from '#/use';

export function useSynth() {
  const started = ref(false)

  const { controls, cv, groups } = useParams(params, 'ref')

  const tempo = useTempo()
  watchEffect(() => {
    controls['fx:bpm'] = tempo.bpm
  })

  const { midi } = useMidi()
  const { voices, cycleNote } = useVoices()
  watch(() => midi.note, n => cycleNote(n.number, n.velocity))

  const { audio, render } = useElementary()
  watch(() => audio.initiated, () => {
    if (!audio.initiated) return

    audio.layers.saw = {
      volume: .7,
      signal: pingPong(generateVoice())
    }

  }, { immediate: true })

  function generateVoice() {
    return el.mul(cv['osc:playing'], cv['osc:volume'], el.blepsaw(cv['osc:frequency']))
  }

  function pingPong(x) {
    return Array(2).fill(null).map((n, i) => el.add(
      x,
      el.mul(
        cv['fx:pingPong'],
        el.delay(
          { size: 44100 },
          el.ms2samps(el.mul(
            el.div(60000, cv['fx:bpm']),
            el.add(1, el.mul(i == 0 ? -.5 : .5, cv['fx:shift']))
          )),
          cv['fx:feedback'],
          x))))
  }

  return { controls, cv, groups, audio, render, started, voices, cycleNote }
}



export function useVoices(count = 12) {

  const voices = reactive(Array(count).fill(true).map((_, i) => ({ key: `v${i}`, gate: 0.0, midi: 69, vel: 0 })))

  const next = ref(0)
  const overflow = ref(0)

  function cycleNote(num = 60, velocity = 0) {
    if (velocity) {
      do {
        next.value++
        if (next.value >= voices.length) {
          next.value = 0
          overflow.value++
        }
        if (overflow.value > 3) break;
      } while (voices[next.value].gate == 1)
      overflow.value = 0
      voices[next.value]['gate'] = 1;
      voices[next.value]['midi'] = num;
      voices[next.value]['vel'] = velocity / 127;
    } else {
      voices.forEach(v => {
        if (v.midi == num) {
          v.gate = 0
        }
      })
    }
  }

  function stopAll(num) {
    voices.forEach(v => v.gate = 0)
  }

  return { voices, cycleNote, stopAll }
}
