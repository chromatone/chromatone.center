import { watch, } from 'vue'
import { useMidi } from '#/use/midi'

import { el } from '@elemaudio/core';

import { midiFrequency } from '../tools/toolbox';
import { useAudio } from '../useAudio'
import { useUI } from '../tools/useUI';
import { useTempo } from '../../../use/tempo.js'
import params from './params.json'
import { useVoices, } from './useVoices';

export function useSynth() {

  const tempo = useTempo()

  const { audio, render } = useAudio()

  const { controls, groups, cv } = useUI(params, 'synth')

  const { voices, cycleNote, stopAll } = useVoices()

  watch([voices, controls], () => {
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
    let frequency = midiFrequency(voice.midi, voice.key)

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