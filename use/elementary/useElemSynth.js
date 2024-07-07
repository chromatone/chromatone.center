import { reactive, ref, watch, } from 'vue'
import { useMidi } from '#/use/midi'

import { el } from '@elemaudio/core';

import { useUI } from './tools/useUI';
import { useTempo } from '#/use/tempo'
import params from './synthParams.json'
import { useVoices, } from './useVoices';
import { useElementary } from './useElementary';

export const synthActive = ref(true)

export function useElemSynth() {

  const tempo = useTempo()

  const { audio, render } = useElementary()

  const { controls, groups, cv } = useUI(params, 'synth')

  const { voices, cycleNote, stopAll } = useVoices()

  watch([voices, controls], () => {

    if (!synthActive.value) return

    audio.layers.synth = {
      volume: 1,
      signal: pingPong(el.scope(
        { name: 'synth', size: 512 },
        poly(voices.list)))
    }
    render('synth')
  })

  const { midi } = useMidi()

  watch(() => midi.note, n => cycleNote(n.number, n.velocity))

  function genVoice(voice) {
    let frequency = midiFrequency(el.const(
      {
        key: `${voice.key}:frequency`,
        value: voice.midi
      }), voice.key)

    let osc = el.mul(
      cv['osc:gain'],
      el.adsr(
        cv['osc:attack'],
        cv['osc:decay'],
        cv['osc:sustain'],
        cv['osc:release'],
        el.const({ key: `${voice.key}:gate`, value: voice.gate })),
      el.lowpass(
        el.mul(
          cv['osc:cut-off'],
          frequency),
        cv['osc:cut-q'],
        el.add(
          el.mul(el.sub(1, cv['osc:shape']), el.blepsquare(frequency)),
          el.mul(cv['osc:shape'], el.blepsaw(frequency)),
        )))

    let noise = el.mul(
      cv['noise:gain'],
      el.adsr(
        cv['noise:attack'],
        cv['noise:decay'],
        cv['noise:sustain'],
        cv['noise:release'],
        el.const({ key: `${voice.key}:gate`, value: voice.gate })),
      el.bandpass(
        frequency,
        cv['noise:band-q'],
        el.noise()))

    return el.mul(
      el.const({ key: `${voice.key}:vel`, value: voice.vel }),
      el.add(osc, noise))
  }

  function poly(vs = voices.list) {
    return el.mul(
      cv['main:volume'],
      el.mul(
        el.sqrt(
          el.const({
            key: 'voice-count',
            value: 1 / vs.length
          })),
        el.add(...vs.map(voice => genVoice(voice)))))
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
            60000 / tempo?.bpm,
            el.add(1, el.mul(i == 0 ? -.5 : .5, cv['fx:shift']))
          )),
          cv['fx:feedback'],
          x))))
  }

  return { groups, controls, voices, cycleNote, stopAll }
}

function midiFrequency(x) {
  return el.mul(
    440,
    el.pow(
      2,
      el.smooth(
        el.tau2pole(0.001),
        el.div(
          el.sub(x, 69),
          12
        )
      )
    )
  )
}