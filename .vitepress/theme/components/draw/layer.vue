<script setup lang="ts">
import { useDraw } from './draw'

const svg = ref()

const { drauu, drawingEnabled, loadCanvas } = useDraw()

onMounted(() => {
  drauu.mount(svg.value, svg.value.parentElement!)
  loadCanvas()
})

onBeforeUnmount(() => {
  drauu.unmount()
})
</script>

<template>
  <svg ref="svg" class="absolute w-full h-full top-0 bottom-0 left-0 right-0"
    :class="{ 'pointer-events-none': !drawingEnabled, 'touch-none': drawingEnabled }" />
</template>
