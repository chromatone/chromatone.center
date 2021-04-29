import { colord, extend } from 'colord'
import lchPlugin from 'colord/plugins/lch'

extend([lchPlugin])

export function lchToHsl(n, total) {
  return colord(`lch(70% 40 ${n * (360 / total)} / 0.5`).toHslString()
}

export function levelColor(
  i = 0,
  n = 3,
  reverse = false,
  s = '80%',
  l = '50%',
  a = '0.5',
) {
  if (reverse) {
    i = n - i - 1
  }
  return `hsla(${i * (360 / n)}, ${s}, ${l}, ${a})`
}
