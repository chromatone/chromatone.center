import { NodeRepr_t, el } from '@elemaudio/core';
import { useAudio } from '../useAudio';
import { reactive } from 'vue';
import { watch } from 'vue';

type Signal = number | NodeRepr_t

import params from './params.json'

export function useDrums() {
  const { audio } = useAudio()

  const hit = reactive({
    kick: 0,
    clap: 0,
    hhat: 0
  })

  watch(hit, h => {
    console.log('hit', h)
  })

  return { hit }
}


/**
 * Kick drum synthesis via a pitched sine sweep
 *
 * @param pitch - The base frequency of the kick drum in Hz
 * @param  click - The speed of the pitch envelope, tuned for [0.005s, 1s]
 * @param attack - Attack time in seconds, tuned for [0.005s, 0.4s]
 * @param  decay - Decay time in seconds, tuned for [0.005s, 4.0s]
 * @param drive - A gain multiplier going into the saturator. Tuned for [1, 10]
 * @param gate - The pulse train which triggers the amp envelope
 */

export function kickSynth(
  pitch: Signal,
  click: Signal,
  attack: Signal,
  decay: Signal,
  drive: Signal,
  gate: Signal
): Signal {

  let clean = el.mul(
    el.adsr(attack, decay, 0.0, 0.1, gate),
    el.cycle(
      el.mul(
        el.add(
          1,
          el.mul(
            4,
            el.adsr(0.005, click, 0.0, 0.1, gate))),
        pitch,
      )
    )
  );

  // Then you can drive it into a soft clipper with a gain multiplier in [1, 10]
  return el.tanh(el.mul(clean, drive));
}


/** A quick helper for a sine wave oscillator with a phase offset. */
function cycle(freq, phaseOffset) {
  let t = el.add(el.phasor(freq, 0), phaseOffset);
  let p = el.sub(t, el.floor(t));

  return el.sin(el.mul(2 * Math.PI, p));
}

/**
 * Hi hat drum synthesis via phase modulation.
 *
 * Here we have a carrier sine wave modulated by another sine wave, which is in turn
 * modulated by white noise. The carrier frequency is tuned for a value between 317Hz
 * and 3170Hz, borrowing slightly from the tuning of the DR110. The first modulator runs
 * at exactly twice the frequency of the carrier to introduce square-like harmonics.
 *
 * @param  pitch - Base frequency in the range [317Hz, 3170Hz]
 * @param tone - Bandpass filter cutoff frequency, tuned for [800Hz, 18kHz]
 * @param attack - Attack time in seconds, tuned for [0.005s, 0.2s]
 * @param decay - Decay time in seconds, tuned for [0.005s, 4.0s]
 * @param gate - The pulse train which triggers the amp envelope
 */
export function hatSynth(pitch: Signal = 0, tone: Signal = 1000, attack: Signal = 10, decay: Signal = 800, gate: Signal) {
  // Synthesis
  let m2 = el.noise();
  let m1 = cycle(el.mul(2, pitch), el.mul(2, m2));
  let m0 = cycle(pitch, el.mul(2, m1));

  // Then we run the result through a bandpass filter set according to tone
  // between 800Hz and 18kHz.
  let f = el.bandpass(tone, 1.214, m0);

  // Finally we have the amp envelope with an attack in [5ms, 200ms] and a
  // decay in [5ms, 4000ms]
  let env = el.adsr(attack, decay, 0.0, 0.1, el.ge(gate, 0.5));

  return el.mul(f, env);
}

/**
 * Clap synthesis via filtered white noise.
 *
 * @param {core.Node|number} tone - Bandpass filter cutoff frequency, tuned for [400Hz, 3500Hz]
 * @param {core.Node|number} attack - Attack time in seconds, tuned for [0s, 0.2s]
 * @param {core.Node|number} decay - Decay time in seconds, tuned for [0s, 4.0s]
 * @param {core.Node|number} gate - The pulse train which triggers the amp envelope
 * @returns {core.Node}
 */
export function clapSynth(tone, attack, decay, gate) {
  // Layered white noise synthesis
  let no = el.noise();

  let e1 = el.adsr(el.add(0.035, attack), el.add(0.06, decay), 0.0, 0.1, gate);
  let e2 = el.adsr(el.add(0.025, attack), el.add(0.05, decay), 0.0, 0.1, gate);
  let e3 = el.adsr(el.add(0.015, attack), el.add(0.04, decay), 0.0, 0.1, gate);
  let e4 = el.adsr(el.add(0.005, attack), el.add(0.02, decay), 0.0, 0.1, gate);

  // Then we run the result through a bandpass filter set according to tone
  // between 400Hz and 3500Hz, and slightly saturate.
  return el.tanh(
    el.bandpass(
      tone,
      1.214,
      el.add(
        el.mul(no, e1),
        el.mul(no, e2),
        el.mul(no, e3),
        el.mul(no, e4),
      ),
    )
  );
}