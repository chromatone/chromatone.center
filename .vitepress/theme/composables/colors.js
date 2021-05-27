import { colord, extend } from 'colord'
import lchPlugin from 'colord/plugins/lch'
// https://www.npmjs.com/package/colord
import mixPlugin from 'colord/plugins/mix'

extend([mixPlugin])
extend([lchPlugin])

export const clrd = colord

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

const mixedColor = computed(() => {
  let mixer = clrd(lchToHsl(props.tonic, 12, 1))
  props.chroma.split('').forEach((bit, i) => {
    if (isInChord(i)) {
      mixer = mixer.mix(lchToHsl(i, 12, 1), 0.5)
    }
  })
  return mixer.toHslString()
})
