import { ref, watchEffect, watch } from 'vue';
import { el } from '@elemaudio/core';
import { useMidi, useTempo } from '#/use';
import { midiFrequency } from './utils';
import { useParams } from './useParams';
import { useSynthVoices } from './useVoices';
import { useElementary, layers } from './useElementary';

const params = {
  "osc:volume": { "value": 0.8, "min": 0, "max": 1, "step": 0.01 },
  "osc:shape": { "value": 0.2, "min": 0, "max": 1, "step": 0.01 },
  "osc:cut-off": { "value": 4, "min": 0.25, "max": 32, "step": 0.01 },
  "osc:cut-q": { "value": 1.1, "min": 0, "max": 5, "step": 0.01 },
  "osc:attack": { "value": 0.01, "min": 0.001, "max": 5, "step": 0.01 },
  "osc:decay": { "value": 0.01, "min": 0.001, "max": 4, "step": 0.01 },
  "osc:sustain": { "value": 0.5, "min": 0, "max": 1, "step": 0.01 },
  "osc:release": { "value": 0.1, "min": 0.001, "max": 10, "step": 0.01 },


  "noise:gain": { "value": 0.5, "min": 0, "max": 1, "step": 0.01 },
  "noise:band-q": { "value": 50, "min": 0, "max": 100, "step": 0.1 },
  "noise:cut-off": { "value": 4, "min": 0.25, "max": 32, "step": 0.001 },
  "noise:cut-q": { "value": 1.1, "min": 0, "max": 5, "step": 0.01 },
  "noise:attack": { "value": 0.01, "min": 0.001, "max": 5, "step": 0.01 },
  "noise:decay": { "value": 0.01, "min": 0.001, "max": 4, "step": 0.01 },
  "noise:sustain": { "value": 0.5, "min": 0, "max": 1, "step": 0.01 },
  "noise:release": { "value": 0.01, "min": 0.001, "max": 10, "step": 0.01 },


  "fx:pingPong": { "value": 0.1, "min": 0, "max": 1, "step": 0.01 },
  "fx:feedback": { "value": 0.1, "min": 0, "max": 1, "step": 0.01 },
  "fx:shift": { "value": 0.4, "min": 0, "max": 1, "step": 0.01 },

  "fx:bpm": { "value": 120, "min": 10, "max": 500, "step": 1, "hidden": true }
}

export const synthEnabled = ref(true);

export function useRefSynth(count = 12) {
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
    const poly = createPoly();
    return pingPong(el.scope({ name: 'synth', size: 512 }, poly));
  }

  function createPoly() {
    return el.mul(
      el.sqrt(el.div(1, el.const({ key: 'voice-count', value: voiceRefs.length }))),
      el.add(...voiceRefs.map((_, i) => createVoice(i)))
    );
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
    const envelope = el.adsr(cv["osc:attack"], cv["osc:decay"], cv["osc:sustain"], cv["osc:release"], gate);
    const oscillator = el.select(
      cv['osc:shape'],
      el.blepsquare(midiFrequency(midi)),
      el.blepsaw(midiFrequency(midi))
    );
    const filter = el.lowpass(
      el.mul(cv['osc:cut-off'], midiFrequency(midi)),
      cv['osc:cut-q'],
      oscillator
    );

    return el.mul(cv['osc:volume'], envelope, el.div(vel, 127), filter);
  }

  function createNoise(gate, midi) {
    const envelope = el.adsr(cv['noise:attack'], cv['noise:decay'], cv['noise:sustain'], cv['noise:release'], gate);
    const noiseSrc = el.noise();
    const filter = el.bandpass(midiFrequency(midi), cv['noise:band-q'], noiseSrc);

    const lowpass = el.lowpass(
      el.mul(cv['noise:cut-off'], midiFrequency(midi)),
      cv['noise:cut-q'],
      filter
    );

    return el.mul(cv['noise:gain'], envelope, lowpass);
  }

  function pingPong(input) {
    return [0, 1].map(i => el.add(
      input,
      el.mul(
        cv['fx:pingPong'],
        el.delay(
          { size: 44100 },
          el.ms2samps(el.mul(
            el.div(60000, cv['fx:bpm']),
            el.add(1, el.mul(i === 0 ? -.5 : .5, cv['fx:shift']))
          )),
          cv['fx:feedback'],
          input
        )
      )
    ));
  }

  return { controls, cv, groups, audio, render, voiceRefs, cycleNote, stopAll, synthEnabled };
}