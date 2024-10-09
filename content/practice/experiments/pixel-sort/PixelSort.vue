<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { useClamp } from '@vueuse/math'
import { notes, midi, globalScale } from '#/use'
import { rgbToHsl, extractColorsFromPixels, getHueIndex } from './utils'
import { playNote, stopNote } from '#/use/midi'

const imageUrl = ref(null)
const scanDirection = ref('horizontal')
const canvasElement = ref(null)
const { elementX: x, elementY: y, isOutside, elementHeight, elementWidth } = useMouseInElement(canvasElement)

const colorCount = useClamp(ref(5), 1, 7)
const extractedColors = ref([])

const lineWidth = ref(20)

// Function to rotate array
function rotateArray(arr, count = 1) {
  return [...arr.slice(count, arr.length), ...arr.slice(0, count)]
}

// Compute the current scale chroma
const currentScaleChroma = computed(() => {
  if (!globalScale.value || !globalScale.value.chroma) {
    // Default to chromatic scale if globalScale is not set
    return [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  }
  const chromeArray = globalScale.value.chroma.split('').map(Number)
  return rotateArray(chromeArray, -notes.indexOf(globalScale.value.tonic || 'C'))
})

function quantizeNote(noteName, octave) {
  const noteIndex = notes.indexOf(noteName)
  const scaleNotes = currentScaleChroma.value.map((val, index) => val ? notes[index] : null).filter(Boolean)

  if (currentScaleChroma.value[noteIndex]) {
    return `${noteName}${octave}`
  }

  let lowerNote = noteIndex
  let upperNote = noteIndex
  while (!currentScaleChroma.value[lowerNote] && !currentScaleChroma.value[upperNote]) {
    lowerNote = (lowerNote - 1 + 12) % 12
    upperNote = (upperNote + 1) % 12
    if (currentScaleChroma.value[lowerNote]) return `${notes[lowerNote]}${octave}`
    if (currentScaleChroma.value[upperNote]) return `${notes[upperNote]}${octave}`
  }

  return `${noteName}${octave}` // fallback to original note if something goes wrong
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    imageUrl.value = URL.createObjectURL(file)
  }
}

function getPixelsAlongLine(ctx, x, y, direction) {
  const imageData = direction === 'horizontal'
    ? ctx.getImageData(0, y * ctx.canvas.height - lineWidth.value / 2, ctx.canvas.width, lineWidth.value)
    : ctx.getImageData(x * ctx.canvas.width - lineWidth.value / 2, 0, lineWidth.value, ctx.canvas.height)

  return imageData.data
}

function getColor(hueIndex, s, l) {
  const hue = (hueIndex * 30) % 360
  return `hsl(${hue}, ${s * 100}%, ${l * 100}%)`
}

function getNoteWithOctave(hueIndex, l) {
  const noteName = notes[hueIndex]
  const octave = Math.floor(l * 3) - 1 + 3 + midi.offset
  return quantizeNote(noteName, octave)
}

watch([x, y], () => {
  if (isOutside.value || !canvasElement.value) return

  const ctx = canvasElement.value.getContext('2d')
  const pixels = getPixelsAlongLine(ctx, x.value / elementWidth.value, y.value / elementHeight.value, scanDirection.value)
  extractedColors.value = extractColorsFromPixels(pixels, colorCount.value)
})

watch(imageUrl, async () => {
  if (imageUrl.value) {
    const img = new Image()
    img.src = imageUrl.value
    await img.decode()

    const canvas = canvasElement.value
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
})

function handleClick(ev) {
  const noteList = extractedColors.value.map(c => getNoteWithOctave(c.hueIndex, c.l))
  playNote(noteList)
  setTimeout(() => {
    stopNote(noteList)
  }, 200)
}

</script>

<template lang="pug">
.container.mx-auto
  .relative.w-90vw.h-90vh.overflow-hidden(v-if="imageUrl")
    canvas.w-full.h-full.max-w-screen.max-h-full(ref="canvasElement" width="1200" height="1200")

    .absolute.flex(
      @mousedown="handleClick"
      @touchstart="handleClick"
      :class="{ 'w-full h-5': scanDirection === 'horizontal', 'h-full w-5 flex-col': scanDirection === 'vertical' }" :style="scanDirection === 'horizontal' ? `top: ${Math.max(0, y - lineWidth / 2)}px` : `left: ${0}px`")
      .relative.flex.items-center.justify-center(v-for="color in extractedColors" :key="color.hueIndex" :style="{ flex: `1 1 ${color.percent}%`, backgroundColor: getColor(color.hueIndex, color.s, color.l) }")
        span.text-xs.font-bold.text-white.text-shadow.p-1 {{ getNoteWithOctave(color.hueIndex, color.l) }}

  .p-4.flex.flex-wrap.gap-2
    .m-0
      label.cursor-pointer.bg-blue-500.hover-bg-blue-600.text-white.font-bold.py-2.px-4.rounded(for="fileInput") Load Image
      input#fileInput.hidden(type="file" accept="image/*" @change="handleFileUpload")

    .m-0
      label.mr-2 Scan direction:
      select(v-model="scanDirection")
        option(value="horizontal") Horizontal
        option(value="vertical") Vertical

    .m-0
      label.mr-2 Color count:
      input(type="range" v-model="colorCount" min="1" max="7" step="1")
      span.ml-2 {{ colorCount }}

</template>

<style scoped>
.text-shadow {
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}
</style>