import { el } from '@elemaudio/core';
import { ref, watch } from 'vue';

import params from './params.json'

import { useElementary } from '#/use/elementary/useElementary.js';
import { useParams } from '#/use/elementary/useParams.js';
import { useMidi, useTempo } from '#/use';

import { useVoices } from './useVoices';

export function useSynth() {
  const started = ref(false)

  const { controls, cv, groups } = useParams(params, 'ref')

  const tempo = useTempo()
  watch(() => tempo.bpm, bpm => {
    controls['fx:bpm'] = bpm
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
        cv['fx:feedback'],
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