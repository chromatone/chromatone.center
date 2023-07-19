import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useMidi } from '#/use/midi'

import { NodeRepr_t, el } from '@elemaudio/core';

import { midiFrequency } from './toolbox';
import { useUI } from './useUI';
import { useElemAudio } from './useElemAudio';
import { unref } from 'vue';



export function useSynth(title = 'noise') {
  // if (!synth.initiated) {
  //   synth.init()
  //   synth.initiated = true
  // }

  const params = [
    //MAIN
    { name: 'noise:volume', value: .2, min: 0, max: 1, step: .01 },
    // NOISE
    { name: 'noise:gain', value: .5, min: 0, max: 1, step: .01 },
    { name: 'noise:attack', value: .01, min: 0.001, max: 5, step: .01 },
    { name: 'noise:decay', value: .01, min: 0.001, max: 4, step: .01 },
    { name: 'noise:sustain', value: .5, min: 0, max: 1, step: .01 },
    { name: 'noise:release', value: .01, min: 0.001, max: 10, step: .01 },
    // FX
    { name: 'noise:fx:pingPong', value: .3, min: 0, max: 1, step: .01 },
  ]

  const { controls, groups, cv } = useUI(params, title)

  const synth = reactive({
    initiated: false,
    params,
    voices: Array(8).fill(true).map((_, i) => ({ key: `v${i}`, gate: 0.0, midi: 69, vel: 0 })),
    nextVoice: 0,
    overflow: 0,
    cycleNote(num, velocity) {
      if (velocity) {
        do {
          synth.nextVoice++
          if (synth.nextVoice >= synth.voices.length) {
            synth.nextVoice = 0
            synth.overflow++
          }
          if (synth.overflow > 3) break;
        } while (synth.voices[synth.nextVoice].gate == 1)
        synth.overflow = 0
        synth.voices[synth.nextVoice]['gate'] = 1;
        synth.voices[synth.nextVoice]['midi'] = num;
        synth.voices[synth.nextVoice]['vel'] = velocity / 127;
      } else {
        synth.voices.forEach(v => {
          if (v.midi == num) {
            v.gate = 0
          }
        })
      }
    },
    stopAll(num?: number) {
      synth.voices.forEach(v => v.gate = 0)
    },
    voice(voice: { key: string, gate: number, midi: number, vel: number, }) {
      let frequency = midiFrequency(voice.midi, voice.key)

      let noise = el.mul(
        cv['noise:gain'],
        el.const({ key: `${voice.key}:vel`, value: voice.vel }),
        el.adsr(
          cv['noise:attack'],
          cv['noise:decay'],
          cv['noise:sustain'],
          cv['noise:release'],
          el.const({ key: `${voice.key}:gate`, value: voice.gate })),
        el.bandpass(frequency, 50, el.noise()))

      return el.add(noise)
    },
    poly: (voices = synth.voices) =>
      el.mul(
        cv['noise:volume'],
        el.mul(
          el.sqrt(
            el.const({
              key: 'voice-count',
              value: 1 / voices.length
            })),
          el.add(...voices.map(voice => synth.voice(voice))))),
    pingPong(x: NodeRepr_t | number): (number | NodeRepr_t)[] {
      return Array(2).fill(null).map((n, i) => el.add(
        x,
        el.mul(
          cv['noise:fx:pingPong'],
          el.delay(
            { size: 44100 },
            el.ms2samps(300 * (1 + i * .75)),
            .2,
            x))))
    },
    render() {
      const { audio, layers, render } = useElemAudio()

      const main = el.scope(
        { name: title, size: 512 },
        synth.poly(synth.voices))


      layers[title] = {
        component: 'elem-synth',
        volume: 1,
        signal: synth.pingPong(main)
      }

      render()
    },
    async init() {
      watch(synth, synth.render)
    }
  })

  synth.init()

  const { midi } = useMidi()
  watch(() => midi.note, playMidiNote)
  function playMidiNote(n) {
    synth.cycleNote(n.number, n.velocity)
  }

  return { synth, controls, groups, params }
}