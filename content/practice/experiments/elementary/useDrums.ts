import { NodeRepr_t, el } from '@elemaudio/core';
import { useAudio } from './useAudio';
import { reactive } from 'vue';
import { generateUI } from './shared';

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

export function kick(
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