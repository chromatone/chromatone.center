import { NodeRepr_t, el } from '@elemaudio/core';

import { reactive } from 'vue';
import { generateUI } from './shared';
import { watch } from 'vue';
import { useAudio } from './useAudio';
import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';


export function useSequencer() {


  const sequencer = reactive({
    mute: false,
    playing: false,
    reset: 0,
    volume: useClamp(useStorage('seq:volume', 0.7), 0, 1),
    bpm: useStorage('seq:bpm', 120),
    interval: computed(() => 60000 / sequencer.bpm),
    tracks: {
      hhat: Array(16).fill(1),
      clap: Array(16).fill(0),
      kick: Array(16).fill(0),
    },
    hit: {
      hhat: 0,
      clap: 0,
      kick: 0,
    },
    train: computed(() => el.train({ key: 'seq:train' },
      el.sm(
        el.const({
          key: 'seq:freq',
          value: sequencer.playing ? sequencer.bpm / 15 : 0
        }))))
  })

  watch(sequencer, s => {
    const audio = useAudio()

    // const metro = el.metro({ interval: s.interval })
    const reset = el.const({ key: 'seq:reset', value: sequencer.reset })

    const all = el.mul(
      el.const({
        key: 'seq:volume',
        value: sequencer.volume
      }),
      el.scope(
        { name: 'drums', size: 512 },
        el.add(
          kickSynth(30, 0.254, 0.05, 0.1, 4,
            el.or(
              el.const({
                key: 'hit:kick',
                value: sequencer.hit.kick
              }),
              el.seq2({
                key: 'seq:kick',
                seq: [...s.tracks.kick]
              }, sequencer.train, reset))),
          clapSynth(800, 0.005, 0.204, 0.05,
            el.or(
              el.const({
                key: 'hit:clap',
                value: sequencer.hit.clap
              }), el.seq2({ key: 'seq:clap', seq: [...s.tracks.clap] }, sequencer.train, reset))),
          hatSynth(317, 12000, 0.005, 0.1,
            el.or(
              el.const({
                key: 'hit:hhat',
                value: sequencer.hit.hhat
              }), el.seq2({ key: 'seq:hh', seq: [...s.tracks.hhat] }, sequencer.train, reset))),
        )))

    audio.layers.seq = [all, all]

    audio.render()
  })

  return { sequencer }
}

type Signal = number | NodeRepr_t

const params = [
  //Kick
  { name: 'kick:volume', value: .2, min: 0, max: 1, step: .01 },
  { name: 'kick:pitch', value: 50, min: 20, max: 110, step: .001 },
  { name: 'kick:click', value: .1, min: 0.005, max: 1, step: .001 },
  { name: 'kick:attack', value: .1, min: 0.005, max: .4, step: .001 },
  { name: 'kick:decay', value: .1, min: 0.005, max: 5, step: .001 },
  { name: 'kick:drive', value: 1, min: 1, max: 10, step: .001 },
]

const ui = generateUI(params)

export function useDrums() {
  const audio = useAudio()

  const hit = reactive({
    kick: 0,
    clap: 0,
    hhat: 0
  })

  watch(hit, h => {
    console.log('hit', h)

  })

  return { hit, ui }
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
export function hatSynth(pitch: Signal, tone: Signal, attack: Signal, decay: Signal, gate: Signal) {
  // Synthesis
  let m2 = el.noise();
  let m1 = cycle(el.mul(2, pitch), el.mul(2, m2));
  let m0 = cycle(pitch, el.mul(2, m1));

  // Then we run the result through a bandpass filter set according to tone
  // between 800Hz and 18kHz.
  let f = el.bandpass(tone, 1.214, m0);

  // Finally we have the amp envelope with an attack in [5ms, 200ms] and a
  // decay in [5ms, 4000ms]
  let env = el.adsr(attack, decay, 0.0, 0.1, gate);

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
export function clapSynth(tone, attack, decay, release = 0.1, gate) {
  // Layered white noise synthesis
  let no = el.noise();

  let e1 = el.adsr(el.add(0.035, attack), el.add(0.06, decay), 0.0, release, gate);
  let e2 = el.adsr(el.add(0.025, attack), el.add(0.05, decay), 0.0, release, gate);
  let e3 = el.adsr(el.add(0.015, attack), el.add(0.04, decay), 0.0, release, gate);
  let e4 = el.adsr(el.add(0.005, attack), el.add(0.02, decay), 0.0, release, gate);

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