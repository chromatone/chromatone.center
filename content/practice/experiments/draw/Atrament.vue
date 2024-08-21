<script setup>
import { pitchColor, useMidi } from '#/use';
import Atrament from 'atrament';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useGesture } from '@vueuse/gesture';
import { onKeyStroke, useMouseInElement } from '@vueuse/core'
import { useClamp } from '@vueuse/math';

const canvas = ref()

const drawing = ref(false)

let sketchpad
onMounted(() => {
  sketchpad = new Atrament(canvas.value, {
    width: canvas.value.offsetWidth,
    height: canvas.value.offsetHeight,
    color: 'currentColor',
  })

  watchEffect(() => {
    sketchpad.color = color.value
    sketchpad.weight = weight.value
  })

  sketchpad.addEventListener('strokestart', () => drawing.value = true);
  sketchpad.addEventListener('strokeend', () => drawing.value = false);
})

const weight = useClamp(30, 0.1, 3000)

const color = computed(() => pitchColor(midi?.note?.pitch, midi?.note?._octave))

const { midi } = useMidi()

const gestureOptions = {
  // drag: { preventWindowScrollY: true },
  wheel: { preventWindowScrollY: true },
  eventOptions: { capture: false, passive: false },
}

useGesture({
  // onDrag: handleInteraction,
  onWheel: handleInteraction
}, {
  ...gestureOptions,
  domTarget: canvas
});

function handleInteraction(ev) {
  const { delta: [x, y], wheeling, shiftKey, event } = ev
  if (!wheeling) return
  if (event) event.preventDefault();
  const diff = shiftKey ? 12 : 8;
  let step = y / diff
  weight.value += step
}


onKeyStroke('Enter', (e) => {
  sketchpad.clear()
})

const { elementX, elementY } = useMouseInElement(canvas)

</script>

<template lang='pug'>
.p-0.relative.min-h-90vh
  .z-1000.pointer-events-none.rounded-full.absolute.top-10.left-10.w-30(
    v-show="!drawing"
    :style="{ backgroundColor: color, transform: 'translate(-50%, -50%)', width: `${weight}px`, height: `${weight}px`, top: `${elementY}px`, left: `${elementX}px` }") &nbsp;
  canvas(ref="canvas" width="800" height="800")
</template>

<style scoped>
canvas {
  cursor: crosshair;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 3em;
  z-index: 2;
}
</style>