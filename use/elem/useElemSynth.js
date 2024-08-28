import { ref, watchEffect, watch } from 'vue';
import { el } from '@elemaudio/core';
import { useMidi, useTempo } from '#/use';
import { midiFrequency } from './utils';
import { useParams } from './useParams';
import { useSynthVoices } from './useVoices';
import { useElementary, layers } from './useElementary';

import params from "./synthParams.json"
import { useStorage } from '@vueuse/core';

export const synthEnabled = useStorage('el-synth-enabled', true);

export function useElemSynth(count = 12) {
  const { audio, render } = useElementary();
  const { controls, cv, groups } = useParams(params, 'ref');
  const { voiceRefs, cycleNote, stopAll, getVoiceParam } = useSynthVoices();

  const tempo = useTempo();

  watchEffect(() => {
    controls['fx:bpm'] = tempo.bpm;
  });

  const { midi } = useMidi();

  watch(() => midi.note, n => {
    if (synthEnabled.value) {
      cycleNote(n.number, n.velocity);
      render();
    }
  });

  watchEffect(() => {
    if (audio.initiated) {
      layers.synth = {
        volume: 1,
        signal: createSynthSignal()
      };
      render('synth');
    }
  });

  function createSynthSignal() {
    const poly = el.scope({ name: 'synth', size: 512 }, createPoly());
    return pingPong(poly);
  }


  function createPoly() {
    return el.tanh(el.mul(
      el.sqrt(el.div(1, el.const({ key: 'voice-count', value: voiceRefs.length }))),
      el.add(...voiceRefs.map((_, i) => createVoice(i)))
    ));
  }

  function createVoice(index) {
    const gate = getVoiceParam(index, 'gate');
    const midi = getVoiceParam(index, 'midi');
    const vel = getVoiceParam(index, 'vel');

    const osc = createOscillator(gate, midi, vel);
    const noise = createNoise(gate, midi);

    return el.add(osc, noise);
  }

  function createOscillator(gate, midi, vel) {
    const envelope = el.adsr(
      el.div(el.mul(15, cv["osc:attack"]), cv['fx:bpm']),
      el.div(el.mul(15, cv["osc:decay"]), cv['fx:bpm']),
      cv["osc:sustain"],
      el.div(el.mul(15, cv["osc:release"]), cv['fx:bpm']),
      gate);

    const filterEnvelope = el.adsr(
      el.div(el.mul(15, cv["osc:f-attack"]), cv['fx:bpm']),
      el.div(el.mul(15, cv["osc:f-decay"]), cv['fx:bpm']),
      cv["osc:f-sustain"],
      el.div(el.mul(15, cv["osc:f-release"]), cv['fx:bpm']),
      gate
    );

    const squareOsc = el.blepsquare(midiFrequency(midi));
    const sawOsc = el.blepsaw(midiFrequency(midi));

    const squareGain = el.cos(el.mul(cv['osc:shape'], Math.PI / 2));
    const sawGain = el.sin(el.mul(cv['osc:shape'], Math.PI / 2));

    const oscillator = el.add(
      el.mul(squareGain, squareOsc),
      el.mul(sawGain, sawOsc)
    );

    const filterCutoff = el.add(
      cv['osc:cut-off'],
      el.mul(
        el.mul(cv['osc:f-env'], 20000),
        filterEnvelope
      )
    );

    const filter = el.lowpass(
      el.max(20, el.min(20000, filterCutoff)),
      cv['osc:cut-q'],
      oscillator
    );

    return el.tanh(el.mul(cv['osc:volume'], envelope, el.div(vel, 127), filter))
  }

  function createNoise(gate, midi) {
    const envelope = el.adsr(
      el.div(el.mul(15, cv["noise:attack"]), cv['fx:bpm']),
      el.div(el.mul(15, cv["noise:decay"]), cv['fx:bpm']),
      cv["noise:sustain"],
      el.div(el.mul(15, cv["noise:release"]), cv['fx:bpm']),
      gate);

    const filterEnvelope = el.adsr(
      el.div(el.mul(15, cv["noise:f-attack"]), cv['fx:bpm']),
      el.div(el.mul(15, cv["noise:f-decay"]), cv['fx:bpm']),
      cv["noise:f-sustain"],
      el.div(el.mul(15, cv["noise:f-release"]), cv['fx:bpm']),
      gate
    )

    const noiseSrc = el.noise();
    const filter = el.bandpass(midiFrequency(midi), cv['noise:band-q'], noiseSrc);

    const filterCutoff = el.add(
      cv['noise:cut-off'],
      el.mul(
        el.mul(cv['noise:f-env'], 20000),
        filterEnvelope
      )
    );

    const lowpass = el.lowpass(
      el.max(20, el.min(20000, filterCutoff)),
      cv['noise:cut-q'],
      filter
    );

    return el.tanh(el.mul(cv['noise:gain'], envelope, lowpass))
  }

  function pingPong(left, right) {
    return [0, 1].map(i => el.add(
      i ? right || left : left,
      el.mul(
        cv['fx:pingPong'],
        el.delay(
          { size: 44100 },
          el.ms2samps(el.mul(
            el.div(60000, cv['fx:bpm']),
            el.add(1, el.mul(i === 0 ? -.5 : .5, cv['fx:shift']))
          )),
          cv['fx:feedback'],
          i ? right || left : left,
        )
      )
    ));
  }

  return { params, controls, cv, groups, audio, render, voiceRefs, cycleNote, stopAll, synthEnabled };
}