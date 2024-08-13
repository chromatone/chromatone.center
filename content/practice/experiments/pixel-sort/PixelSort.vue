<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { useClamp } from '@vueuse/math'
import { notes, midi } from '#/use'

const imageUrl = ref(null)
const scanDirection = ref('horizontal')
const canvasElement = ref(null)
const { elementX: x, elementY: y, isOutside } = useMouseInElement(canvasElement)

const colorCount = useClamp(ref(5), 5, 7)
const extractedColors = ref([])

const LINE_WIDTH = 20

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    imageUrl.value = URL.createObjectURL(file)
  }
}

function getPixelsAlongLine(ctx, x, y, direction) {
  const imageData = direction === 'horizontal'
    ? ctx.getImageData(0, y - LINE_WIDTH / 2, ctx.canvas.width, LINE_WIDTH)
    : ctx.getImageData(x - LINE_WIDTH / 2, 0, LINE_WIDTH, ctx.canvas.height)

  return imageData.data
}

function extractColorsFromPixels(pixels) {
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
    .slice(0, colorCount.value)
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

function getHueIndex(h) {
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

function rgbToHsl(r, g, b) {
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

function getColor(hueIndex, s, l) {
  const hue = (hueIndex * 30) % 360
  return `hsl(${hue}, ${s * 100}%, ${l * 100}%)`
}

function getNoteWithOctave(hueIndex, l) {
  const noteName = notes[hueIndex]
  const octave = Math.floor(l * 3) - 1 + midi.offset
  return `${noteName}${octave}`
}

watch([x, y], () => {
  if (isOutside.value || !canvasElement.value) return

  const ctx = canvasElement.value.getContext('2d')
  const pixels = getPixelsAlongLine(ctx, x.value, y.value, scanDirection.value)
  extractedColors.value = extractColorsFromPixels(pixels)
})


watch(imageUrl, async () => {
  if (imageUrl.value) {
    const img = new Image()
    img.src = imageUrl.value
    await img.decode()

    const canvas = canvasElement.value
    const ctx = canvas.getContext('2d')

    // Set canvas size while maintaining aspect ratio
    const aspectRatio = img.width / img.height
    const maxWidth = 600 // You can adjust this value
    const maxHeight = 600 // You can adjust this value

    if (aspectRatio > maxWidth / maxHeight) {
      canvas.width = maxWidth
      canvas.height = maxWidth / aspectRatio
    } else {
      canvas.height = maxHeight
      canvas.width = maxHeight * aspectRatio
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
})

</script>

<template lang="pug">
.container.mx-auto.p-4
  .mb-4
    label.cursor-pointer.bg-blue-500.hover-bg-blue-600.text-white.font-bold.py-2.px-4.rounded(for="fileInput") Load Image
    input#fileInput.hidden(type="file" accept="image/*" @change="handleFileUpload")

  .mb-4
    label.mr-2 Scan direction:
    select(v-model="scanDirection")
      option(value="horizontal") Horizontal
      option(value="vertical") Vertical

  .mb-4
    label.mr-2 Color count:
    input(type="range" v-model="colorCount" min="5" max="7" step="1")
    span.ml-2 {{ colorCount }}

  .relative.max-w-screen.max-h-full(v-if="imageUrl")

    canvas.w-full.w-100(ref="canvasElement")

    .absolute.flex(:class="{ 'w-full h-5': scanDirection === 'horizontal', 'h-full w-5 flex-col': scanDirection === 'vertical' }" :style="scanDirection === 'horizontal' ? `top: ${y - 10}px` : `left: ${x - 10}px`")
      .relative.flex.items-center.justify-center(v-for="color in extractedColors" :key="color.hueIndex" :style="{ flex: `1 1 ${color.percent}%`, backgroundColor: getColor(color.hueIndex, color.s, color.l) }")
        span.text-xs.font-bold.text-white.text-shadow {{ getNoteWithOctave(color.hueIndex, color.l) }}
</template>

<style scoped>
.text-shadow {
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}
</style>