import { colord, extend } from "colord";
import lchPlugin from "colord/plugins/lch";
// https://www.npmjs.com/package/colord
import mixPlugin from "colord/plugins/mix";
import namesPlugin from "colord/plugins/names";
import labPlugin from "colord/plugins/lab";
import cmykPlugin from "colord/plugins/cmyk";
import hwbPlugin from "colord/plugins/hwb";

import { pitchColor, isInChroma } from "#/use/calculations";
import { globalScale } from "#/use/chroma";

extend([mixPlugin, lchPlugin, namesPlugin, labPlugin, cmykPlugin, hwbPlugin]);

export const defaultScheme = Array(12).fill(true).map((v, i) => colord(pitchColor(i)).toHex())

export const scheme = reactive({
  default: [...defaultScheme],
  custom: useStorage('custom-colors', [...defaultScheme]),
  isDefault: computed(() => scheme.custom.every((v, i) => v == defaultScheme[i])),
  customize: false,
  reset() {
    scheme.custom = [...defaultScheme]
  }
})

export function noteColor(pitch = 0, octave = 2, velocity = 1, alpha = 1) {
  octave += Math.floor(pitch / 12)
  const diff = octave - 2
  if (scheme.custom[pitch] != scheme.default[pitch]) {
    let c = colord(scheme.custom[pitch])
    c = c.lighten(diff * 0.1)
    return c.alpha(alpha).toHex()
  } else {
    return pitchColor(pitch, octave, velocity, alpha)
  }
}

const minor = "101101011010"
export function calcBg(
  i,
  bit,
  white = 'hsla(0,0%,100%,0.3)',
  black = 'hsla(0,0%,10%,0.3)'
) {
  if (bit == 1) {
    return noteColor((i + globalScale?.tonic) % 12, 3)
  } else if (minor[(i + globalScale?.tonic) % 12] == '1') {
    return white
  } else {
    return black
  }
}


export function lchToHsl(n = 0, total = 12, a = 1, s = 20, lightness = 60) {
  let lch = `lch(${lightness}% ${s} ${n * (360 / total)} / ${a})`;
  let hsl = colord(lch).toHslString();
  return hsl;
}

// export const currentColor = useStorage("main-color", "#333333");

export function getColorInfo(color) {
  const cld = colord(color);
  let info = {
    dark: cld.isDark(),
    hex: cld.toHex(),
    rgb: cld.toRgbString(),
    name: cld.toName({ closest: true }),
    cmyk: cld.toCmykString(),
    hsl: cld.toHslString(),
    lab: cld.toLab(),
  };
  return info;
}

export function levelColor(
  i = 0,
  n = 3,
  a = "0.5",
  s = "0.8",
  l = "0.5",
  reverse = false
) {
  if (reverse) {
    i = n - i - 1;
  }
  return `hsla(${i * (360 / n)}, ${s * 100}%, ${l * 100}%, ${a})`;
}

export function chromaColorMix(chroma, tonic, part = 0.3) {
  let hsl = colord(pitchColor(tonic));
  let lch = colord(lchToHsl(tonic, 12, 1));
  chroma.split("").forEach((bit, i) => {
    if (isInChroma(chroma, tonic, i)) {
      hsl = hsl.mix(pitchColor(i), part);
      lch = lch.mix(lchToHsl(i, 12, 1), part);
    }
  });
  return {
    hsl: hsl.toHslString(),
    lch: lch.toHslString(),
  };
}
