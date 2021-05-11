import { colord, extend } from 'colord'
import lchPlugin from 'colord/plugins/lch'
// https://www.npmjs.com/package/colord

extend([lchPlugin])

export function lchToHsl(n, total, a, s) {
  return colord(
    `lch(70% ${s ? s : '40'} ${n * (360 / total)} / ${a ? a : '0.5'}`,
  ).toHslString()
}

export function levelColor(
  i = 0,
  n = 3,
  a = '0.5',
  s = '80%',
  reverse = false,
  l = '50%',
) {
  if (reverse) {
    i = n - i - 1
  }
  return `hsla(${i * (360 / n)}, ${s}, ${l}, ${a})`
}
