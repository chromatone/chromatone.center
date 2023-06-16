<script setup>
import { ref, computed } from 'vue'
import shader from './chromatone.glsl?raw'
import { TransitionPresets, refDebounced, useTransition } from '@vueuse/core';
import { useMidi } from '#/use/midi'
import { useWindowSize } from '@vueuse/core'
import { useTuner } from '#/use';
const { tuner } = useTuner()

const { width, height } = useWindowSize()

const light = ref(0)

const { midi } = useMidi()

const shaderCode = computed(() => shader)

const notes = computed(() => {
  let chroma = new Array(12).fill(0)
  for (let num in midi?.activeNotes) {
    const n = (Number(num) - 9) % 12
    chroma[n] += midi?.activeNotes[num]
  }

  return chroma.map((el, i) => el + tuner.aChroma[i])
})

const output = useTransition(notes, {
  duration: 200,
  transition: TransitionPresets.easeOutExpo
})

const notesMat4 = computed(() => {
  const mat = Array(16).fill(0);
  output.value.forEach((v, i) => (mat[i] = v));
  return mat;
});

function glslUpdate(tickData) {
  light.value = (Math.sin(tickData.iTime) + 1) / 2;
}

const resized = computed(() => {
  if (width.value || height.value) {
    return Math.random()
  }
  return 0
})

const debounced = refDebounced(resized, 100)

</script>

<template lang='pug'>
.min-h-70svh.h-80svh#screen.rounded-lg.overflow-hidden.pointer-events-auto.touch-revert()
  gl-canvas(@update="glslUpdate" :key="debounced")
    gl-program(name="main", :code="shaderCode")
      gl-float(name="u_light", :value="light")
      gl-mat4(name="u_notes", :value="notesMat4")
</template>
