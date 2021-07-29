import { colord, extend } from 'colord'
import lchPlugin from 'colord/plugins/lch'
// https://www.npmjs.com/package/colord
import mixPlugin from 'colord/plugins/mix'
import { pitchColor, isInChroma } from 'chromatone-theory'

extend([mixPlugin])
extend([lchPlugin])

export function lchToHsl(n = 0, total = 12, a = 0.5, s = 40) {
  let lch = `lch(70% ${s} ${n * (360 / total)} / ${a})`
  let hsl = colord(lch).toHslString()
  return hsl
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

export function chromaColorMix(chroma, tonic) {
  let hsl = colord(pitchColor(tonic))
  let lch = colord(lchToHsl(tonic, 12, 1))
  chroma.split('').forEach((bit, i) => {
    if (isInChroma(chroma, tonic, i)) {
      hsl = hsl.mix(pitchColor(i), 0.5)
      lch = lch.mix(lchToHsl(i, 12, 1), 0.5)
    }
  })
  return {
    hsl: hsl.toHslString(),
    lch: lch.toHslString(),
  }
}
