<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useDraw } from '#/theme/composables/draw'

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

<template lang="pug">
svg.absolute.w-full.h-full.top-0.bottom-0.left-0.right-0(ref="svg" :class="{ 'pointer-events-none': !drawingEnabled, 'touch-none': drawingEnabled }")
</template>
