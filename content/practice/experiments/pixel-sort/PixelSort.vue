<template lang="pug">
.container.mx-auto.p-4
  .mb-4
    label.cursor-pointer.bg-blue-500.hover-bg-blue-600.text-white.font-bold.py-2.px-4.rounded(for="fileInput") Load Image
    input#fileInput.hidden(type="file" accept="image/*" @change="handleFileUpload")

  .mb-4(v-if="imageUrl")
    img.max-w-30(:src="imageUrl" alt="Uploaded image")

  .grid.grid-cols-12.gap-2(v-if="pixelCounts")
    .col-span-1.min-h-50.flex.flex-col.items-stretch(v-for="(column, colIndex) in pixelCounts" :key="colIndex" v-show="totalPercentages[colIndex] > 0.01")
      .text-xs.font-semibold.mb-1.text-center {{ notes[colIndex] }}

      .p-0(v-for="(count, rowIndex) in column.toReversed()" 
      :key="rowIndex" 
      :style="{ flex: `${count * 10}`, backgroundColor: getColor(colIndex, 4 - rowIndex) }"
      ) 
      .flex-1

  
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { notes } from '#/use';

const imageUrl = ref(null)
const pixelCounts = ref(null)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageUrl.value = URL.createObjectURL(file)
  }
}

const useSortedPixels = (image) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0, image.width, image.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData.data

  const counts = Array(12).fill().map(() => Array(5).fill(0))
  let totalPixels = 0

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]

    const [h, s, l] = rgbToHsl(r, g, b)

    const hueIndex = getHueIndex(h)
    const brightnessIndex = Math.floor(l * 5)

    if (hueIndex !== -1 && brightnessIndex < 5) {
      counts[hueIndex][brightnessIndex]++
      totalPixels++
    }
  }

  // Convert counts to relative amounts
  return counts.map(column => column.map(count => count / totalPixels))
}

const getHueIndex = (h) => {
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

const rgbToHsl = (r, g, b) => {
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

const getColor = (hueIndex, brightnessIndex) => {
  const hue = (hueIndex * 30) % 360
  const lightness = 5 + brightnessIndex * 15
  return `hsl(${hue}, 100%, ${lightness}%)`
}

const totalPercentages = computed(() => {
  if (!pixelCounts.value) return null
  return pixelCounts.value.map(column => column.reduce((sum, count) => sum + count, 0))
})



watch(imageUrl, async () => {
  if (imageUrl.value) {
    const img = new Image()
    img.src = imageUrl.value
    await img.decode()
    pixelCounts.value = useSortedPixels(img)
  }
})
</script>