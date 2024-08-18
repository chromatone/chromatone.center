export function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return [h, s, l]
}

export function extractColorsFromPixels(pixels, colors = 5) {
  const colorMap = new Map()

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    const [h, s, l] = rgbToHsl(r, g, b)
    const hueIndex = getHueIndex(h)
    if (hueIndex !== -1) {
      const key = hueIndex
      if (!colorMap.has(key)) {
        colorMap.set(key, { count: 0, s: 0, l: 0 })
      }
      const color = colorMap.get(key)
      color.count++
      color.s += s
      color.l += l
    }
  }

  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, colors)
    .map(([hueIndex, { count, s, l }]) => ({
      hueIndex,
      s: s / count,
      l: l / count,
      percent: (count / (pixels.length / 4)) * 100
    }))

  const totalPercent = sortedColors.reduce((sum, color) => sum + color.percent, 0)
  return sortedColors.map(color => ({
    ...color,
    percent: (color.percent / totalPercent) * 100
  }))
}

export function getHueIndex(h) {
  const hue = h * 360
  for (let i = 0; i < 12; i++) {
    const centerHue = i * 30
    const lowerBound = (centerHue - 15 + 360) % 360
    const upperBound = (centerHue + 15) % 360

    if (lowerBound > upperBound) {
      if (hue >= lowerBound || hue < upperBound) {
        return i
      }
    } else if (hue >= lowerBound && hue < upperBound) {
      return i
    }
  }
  return -1
}