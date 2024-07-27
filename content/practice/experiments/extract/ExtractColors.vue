<script setup>
import { ref, computed, watch } from 'vue'
import { useStorage, useDebouncedRefHistory, useClipboard, useTimeAgo, useDebounceFn } from '@vueuse/core'
import { extractColors } from 'extract-colors'

const useImageColors = (initialN = 7) => {
  const imageUrl = ref(null)
  const colors = ref([])
  const allExtractedColors = ref([])
  const isLoading = ref(false)
  const amount = useStorage('color-extracts', initialN)
  const storedPalettes = useStorage('color-palettes', [])

  const { history, undo, redo, canUndo, canRedo } = useDebouncedRefHistory(storedPalettes, {
    deep: true,
    debounce: 1000
  })

  const generateThumbnail = async (file, size = 32) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const scaleFactor = size / Math.max(img.width, img.height)
          canvas.width = Math.min(size, img.width * scaleFactor)
          canvas.height = Math.min(size, img.height * scaleFactor)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', 0.7))
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const extractColorsFromImage = async (file) => {
    if (!file) return

    isLoading.value = true
    imageUrl.value = URL.createObjectURL(file)
    const thumbnail = await generateThumbnail(file)

    try {
      allExtractedColors.value = await extractColors(imageUrl.value, {
        pixels: 64000,
        distance: 0.12,
        saturationDistance: 0.2,
        lightnessDistance: 0.2,
        hueDistance: 0.1
      })

      updateColors()
      const paletteData = {
        colors: colors.value,
        timestamp: Date.now(),
        amount: amount.value,
        thumbnail,
      }
      storedPalettes.value.unshift(paletteData)
    } catch (error) {
      console.error('Error extracting colors:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateColors = () => {
    colors.value = allExtractedColors.value.slice(0, amount.value)
  }

  const debouncedUpdateColors = useDebounceFn(() => {
    updateColors()
    const paletteData = {
      colors: colors.value,
      timestamp: Date.now(),
      amount: amount.value,
      thumbnail: storedPalettes.value[0]?.thumbnail,
    }
    storedPalettes.value.unshift(paletteData)
  }, 300)

  const colorStyles = computed(() =>
    colors.value.map(color => ({
      backgroundColor: color.hex
    }))
  )

  watch(amount, () => {
    if (allExtractedColors.value.length > 0) {
      debouncedUpdateColors()
    }
  })

  return {
    imageUrl, colors, isLoading, extractColorsFromImage, colorStyles,
    storedPalettes, history, undo, redo, canUndo, canRedo,
    amount
  }
}

const {
  imageUrl, colors, isLoading, extractColorsFromImage, colorStyles,
  storedPalettes, history, undo, redo, canUndo, canRedo,
  amount
} = useImageColors()

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    extractColorsFromImage(file)
  }
}

function clear() {
  storedPalettes.value = []
}

const { copy, copied } = useClipboard()

const formatTimeAgo = (timestamp) => {
  const timeAgo = useTimeAgo(timestamp)
  return timeAgo.value
}

const handleUndo = () => {
  undo()
  if (storedPalettes.value.length > 0) {
    const lastPalette = storedPalettes.value[0]
    colors.value = lastPalette.colors
    amount.value = lastPalette.amount
  }
}

const handleRedo = () => {
  redo()
  if (storedPalettes.value.length > 0) {
    const lastPalette = storedPalettes.value[0]
    colors.value = lastPalette.colors
    amount.value = lastPalette.amount
  }
}
</script>

<template lang="pug">
.container.mx-auto.p-4
  .mb-4.flex.items-center.flex-wrap.gap-4
    label.block.mb-2(for="imageUpload") Upload an image
    input#imageUpload.hidden(type="file" accept="image/*" @change="handleFileUpload")
    label(for="imageUpload").bg-blue-500.hover-bg-blue-600.text-white.font-bold.py-2.px-4.rounded.cursor-pointer
      | Select Image
    .mt-4.space-y-4

    control-rotary(
      v-model="amount"
      :min="2"
      :max="12"
      :step="1"
      param="COLORS"
      :fixed="0"
    )

  .mt-4(v-if="imageUrl")
    img.max-w-100.h-auto.rounded.shadow-lg(:src="imageUrl" alt="Uploaded image")



  .mt-4(v-if="isLoading")
    p.text-gray-600 Extracting colors...

  .mt-4(v-if="colors.length")
    h2.text-xl.font-bold.mb-2 Extracted Colors
    .flex.flex-wrap.gap-4
      .w-24.h-24.rounded.shadow-md.relative.group(
        v-for="(style, index) in colorStyles"
        :key="index"
        :style="style"
      )
        .absolute.inset-0.flex.items-center.justify-center.bg-black.bg-opacity-50.opacity-0.group-hover-opacity-100.transition-opacity
          button.text-white.bg-gray-800.px-2.py-1.rounded(@click="copy(colors[index].hex)")
            | Copy HEX
        .bg-white.bg-opacity-75.p-1.text-xs
          | {{ colors[index].hex }}

  .mt-8
    h2.text-xl.font-bold.mb-2 Color Palette History
    .flex.gap-2.mb-4
      button.bg-blue-500.hover-bg-blue-600.text-white.font-bold.py-1.px-3.rounded(:disabled="!canUndo" @click="handleUndo") Undo
      button.bg-blue-500.hover-bg-blue-600.text-white.font-bold.py-1.px-3.rounded(:disabled="!canRedo" @click="handleRedo") Redo
      button.bg-red-500.hover-bg-blue-600.text-white.font-bold.py-1.px-3.rounded(@click="clear") Clear
    .flex.flex-wrap
      .flex.flex-col.gap-2(v-for="(palette, index) in storedPalettes" :key="index")
        .flex.items-center.gap-4.h-32
          img.max-w-16.max-h-16.blur-2px.object-cover.rounded(v-if="palette.thumbnail" :src="palette.thumbnail" alt="Palette thumbnail")
          .flex.flex-wrap.gap-1.z-10
            .p-4.rounded.shadow-sm(
              v-for="(color, colorIndex) in palette.colors"
              :key="colorIndex"
              :style="{ backgroundColor: color.hex }"
            )
        .text-sm.text-gray-500 
          | {{ formatTimeAgo(palette.timestamp) }} - Amount: {{ palette.amount }}
</template>