import { colord, extend } from 'colord'
import lchPlugin from 'colord/plugins/lch'

extend([lchPlugin])

export function lchToHsl(n, total) {
  return colord(`lch(70% 40 ${n * (360 / total)} / 0.5`).toHslString()
}
