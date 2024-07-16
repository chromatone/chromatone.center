import { ref, watchEffect, watch } from 'vue'
import { el } from '@elemaudio/core';
import { useMidi, useTempo } from '#/use';
import params from './params.json'
import { midiFrequency } from './utils'
import { useParams } from './useParams'
import { useSynthVoices } from './useVoices'
import { useElementary, layers } from './useElementary'

export const synthEnabled = ref(true)
const started = ref(false)

export function useRefSynth(count = 12) {
  const { audio, render } = useElementary()
  const { controls, cv, groups } = useParams(params, 'ref')
  const { voiceRefs, updateVoice, getVoiceParam } = useSynthVoices();

  const next = ref(0)
  const overflow = ref(0)

  function cycleNote(num = 60, velocity = 0) {
    if (velocity) {
      do {
        next.value++
        if (next.value >= voiceRefs.length) {
          next.value = 0
          overflow.value++
        }
        if (overflow.value > 3) break;
      } while (voiceRefs[next.value].gate.value == 1)
      overflow.value = 0

      updateVoice(next.value, { gate: velocity > 0 ? 1 : 0, midi: num, vel: velocity });
    } else {
      voiceRefs.forEach((v, i) => {
        if (v.midi.value == num) {
          updateVoice(i, { gate: 0 });
        }
      })
    }
  }

  function stopAll() {
    voiceRefs.forEach((_, i) => updateVoice(i, { gate: 0 }))
  }

  const tempo = useTempo()
  watchEffect(() => {
    controls['fx:bpm'] = tempo.bpm
  })

  const { midi } = useMidi()

  watch(() => midi.note, n => {
    render()
    if (synthEnabled.value) {
      cycleNote(n.number, n.velocity)
    }
  })

  watchEffect(() => {
    if (audio.initiated) {
      layers.synth = {
        volume: 1,
        signal: pingPong(
          el.scope(
            { name: 'synth', size: 512 },
            poly()
          )
        )
      }
      render('synth')
    }
  })

  function poly() {
    return el.mul(
      el.sqrt(el.div(1, el.const({ key: 'voice-count', value: voiceRefs.length }))),
      el.add(...voiceRefs.map((_, i) => {
        const gate = getVoiceParam(i, 'gate');
        const midi = getVoiceParam(i, 'midi');
        const vel = getVoiceParam(i, 'vel');
        let osc = el.mul(
          cv['osc:volume'],
          el.adsr(cv["osc:attack"], cv["osc:decay"], cv["osc:sustain"], cv["osc:release"], gate),
          el.div(vel, 127),
          el.lowpass(
            el.mul(cv['osc:cut-off'], midiFrequency(midi)),
            cv['osc:cut-q'],
            el.add(
              el.mul(el.sub(1, cv['osc:shape']), el.blepsquare(midiFrequency(midi))),
              el.mul(cv['osc:shape'], el.blepsaw(midiFrequency(midi)))
            )
          )
        )

        let noise = el.mul(
          cv['noise:gain'],
          el.adsr(cv['noise:attack'], cv['noise:decay'], cv['noise:sustain'], cv['noise:release'], gate),
          el.bandpass(midiFrequency(midi), cv['noise:band-q'], el.noise())
        )

        return el.add(osc, noise)
      }))
    )
  }

  function pingPong(x) {
    return Array(2).fill(null).map((_, i) => el.add(
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

  return { controls, cv, groups, audio, render, started, voiceRefs, cycleNote, stopAll, synthEnabled }
}