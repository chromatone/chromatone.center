import { ref, watchEffect, watch } from 'vue';
import { el } from '@elemaudio/core';
import { useMidi, useTempo } from '#/use';
import { midiFrequency, srvb } from './nodes';
import { useParams } from './useParams';
import { useSynthVoices } from './useVoices';
import { useElementary, layers } from './useElementary';

import params from "./synthParams.json"
import { useStorage } from '@vueuse/core';

export const synthEnabled = useStorage('el-synth-enabled', true);

export function useElemSynth(count = 12) {
  const { audio, render, meters } = useElementary();
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
    }
  });

  watchEffect(async () => {
    if (audio.initiated) {
      await loadSamples()
      layers.synth = {
        volume: 1,
        signal: createSynthSignal()
      };
      render('synth');
    }
  });


  function createSynthSignal() {
    const poly = el.scope(
      { name: 'synth', size: 512 },
      el.tanh(
        el.mul(
          el.sqrt(
            el.div(
              1,
              el.const({ key: 'voice-count', value: voiceRefs.length }))),
          el.add(
            ...voiceRefs.map((_, i) => createVoice(i)))
        ))
    );

    const signal = pingPong(poly);

    // let rev = srvb({
    //   key: 'srvb',
    //   sampleRate: meters['main:sample-rate']?.max || 44100,
    //   size: cv['reverb:size'],
    //   decay: cv['reverb:decay'],
    //   mod: cv['reverb:mod'],
    //   mix: el.mul(cv['reverb:mix'], cv['reverb:on']),
    // }, signal[0], signal[1])

    return signal
  }


  function createVoice(index) {
    const gate = getVoiceParam(index, 'gate')
    const midi = getVoiceParam(index, 'midi')
    const vel = getVoiceParam(index, 'vel')
    const velocity = el.div(vel, 127)


    const osc = createOscillator(gate, midi, velocity)
    const noise = createNoise(gate, midi, velocity)
    const string = createString(gate, midi, velocity)
    const sampler = createSampler(gate, midi, velocity)

    return el.scope({ name: `synth-voice-${index}`, size: 1024 }, el.add(osc, noise, string, sampler))
  }

  async function loadSamples() {
    let res = await fetch('/audio/piano/A4.mp3');
    let sampleBuffer = await audio.ctx.decodeAudioData(await res.arrayBuffer());

    audio.core.updateVirtualFileSystem({
      'piano': sampleBuffer.getChannelData(0),
    });
  }

  function createSampler(gate, midi, vel) {

    const envelope = el.adsr(
      el.div(el.mul(15, cv["sample:attack"]), cv['fx:bpm']),
      el.div(el.mul(15, cv["sample:decay"]), cv['fx:bpm']),
      cv["sample:sustain"],
      el.div(el.mul(15, cv["sample:release"]), cv['fx:bpm']),
      gate);

    const sample = el.sample({ path: 'piano' }, gate, el.div(midiFrequency(midi), 440))

    const shaped = el.mul(sample, vel, envelope, cv['sample:on'], cv['sample:gain'])

    return el.mul(48, el.compress(10, 100, -48, 2, shaped, shaped))
  }



  function createOscillator(gate, midi, vel) {

    const squareOsc = el.blepsquare(midiFrequency(midi));
    const sawOsc = el.blepsaw(midiFrequency(midi));

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

    const oscVoice = el.tanh(el.mul(cv['osc:on'], cv['osc:gain'], envelope, vel, filter))

    return oscVoice
  }

  function createString(gate, midi, vel) {

    let freq = el.mul(440, el.pow(2, el.div(el.sub(midi, 69), 12)))

    let delTime = el.div(el.sr(), freq)

    let adsr = el.adsr(cv['string:attack'], cv['string:decay'], cv['string:sustain'], cv['string:release'], gate)

    let excitation = el.mul(adsr, el.noise(), cv['string:noise'])

    let bandpass = el.bandpass(freq, cv['string:q'], excitation)

    const filterEnvelope = el.adsr(
      el.div(el.mul(15, cv["string:f-attack"]), cv['fx:bpm']),
      el.div(el.mul(15, cv["string:f-decay"]), cv['fx:bpm']),
      cv["string:f-sustain"],
      el.div(el.mul(15, cv["string:f-release"]), cv['fx:bpm']),
      gate
    )

    const filterCutoff = el.add(
      cv['string:cut-off'],
      el.mul(
        el.mul(cv['string:f-env'], 20000),
        filterEnvelope
      )
    );

    const filter = el.lowpass(
      el.max(20, el.min(20000, filterCutoff)),
      cv['string:cut-q'],
      bandpass
    );

    let dl = el.delay(
      { size: 44100 },
      delTime,
      cv['string:feedback'],
      filter
    )

    return el.mul(cv['string:on'], cv['string:gain'], vel, el.tanh(dl))
  }

  function createNoise(gate, midi, vel) {
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

    const whiteGain = el.cos(el.mul(cv['noise:color'], Math.PI / 2));
    const pinkGain = el.sin(el.mul(cv['noise:color'], Math.PI / 2));

    const noiseSrc = el.add(
      el.mul(whiteGain, el.noise()),
      el.mul(pinkGain, el.pinknoise())
    );

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

    return el.tanh(el.mul(cv['noise:on'], cv['noise:gain'], vel, envelope, lowpass))
  }

  function pingPong(left, right) {
    return [0, 1].map(i => el.add(
      i ? right || left : left,
      el.mul(
        cv['ping-pong:on'],
        cv['ping-pong:gain'],
        el.delay(
          { size: 44100 },
          el.ms2samps(el.mul(
            el.div(60000, cv['fx:bpm']),
            el.add(1, el.mul(i === 0 ? -.5 : .5, cv['ping-pong:shift']))
          )),
          cv['ping-pong:feedback'],
          i ? right || left : left,
        )
      )
    ));
  }

  return { params, controls, cv, groups, audio, render, voiceRefs, cycleNote, stopAll, synthEnabled };
}