import { el } from '@elemaudio/core';

export function midiFrequency(x) {
  return el.mul(
    440,
    el.pow(
      2,
      el.smooth(
        el.tau2pole(0.001),
        el.div(
          el.sub(x, 69),
          12
        )
      )
    )
  )
}