
import { NodeRepr_t, el } from '@elemaudio/core';

export function pingPong(x: NodeRepr_t): (number | NodeRepr_t)[] {
  return Array(2).fill(null).map((n, i) => el.add(
    x,
    el.mul(
      0.3,
      el.delay(
        { size: 44100 },
        el.ms2samps(300 * (1 + i * .75)),
        .2,
        x))))
}