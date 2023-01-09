<script setup>
import createGlobe from 'cobe'

const props = defineProps({
  dots: { type: Array, default: [] },
  center: { type: Array, default: [0, 70] }
})

const canvas = ref()

let phi = 0

const markers = props.dots.map(dot => ({ location: dot, size: 0.05 }))


onMounted(() => {
  const globe = createGlobe(canvas.value, {
    devicePixelRatio: 2,
    width: 1000,
    height: 1000,
    phi: 0,
    theta: 0.28,
    dark: 0,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 9,
    baseColor: [0.8, 0.8, 0.8],
    markerColor: [0.3, 0.9, 0.7],
    glowColor: [1, 1, 1],
    markers: [{ location: props.center, size: 0.0 }, ...markers],
    onRender: (state) => {
      // Called on every animation frame.
      // `state` will be an empty object, return updated params.
      state.phi = phi
      phi += 0.0025
    },
  })
})



</script>

<template lang="pug">
canvas.w-full.h-500px.m-auto.rounded-2xl(ref="canvas")
</template>