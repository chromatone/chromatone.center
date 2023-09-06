
import { NodeRepr_t, el } from '@elemaudio/core';

export function midiFrequency(num: number, key: string): (number | NodeRepr_t) {
  return el.mul(
    440,
    el.pow(
      2,
      el.smooth(
        el.tau2pole(0.001),
        el.const(
          {
            key: `${key}:frequency`,
            value: (num - 69) / 12
          })
      )
    )
  )
}