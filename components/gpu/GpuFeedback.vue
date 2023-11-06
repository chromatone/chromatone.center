<script setup>
import { ref, computed } from 'vue'
import shader from './feedback.glsl?raw'
import { TransitionPresets, refDebounced, useTransition } from '@vueuse/core';
import { useMidi } from '#/use/midi'
import { useWindowSize } from '@vueuse/core'
import { useTuner } from '#/use';

const { tuner, init } = useTuner()

const { width, height } = useWindowSize()

const light = ref(0)

const initiated = ref(false)

const { midi } = useMidi()

const shaderCode = computed(() => shader)

const notes = computed(() => {
  let chroma = new Array(12).fill(0)
  for (let num in midi?.activeNotes) {
    const n = (Number(num) - 9) % 12
    chroma[n] += midi?.activeNotes[num]
  }

  return chroma.map((el, i) => {
    let val = Math.pow(tuner.aChroma[i], 2)
    let input = val > Math.pow(tuner.chromaAvg, 2) && !tuner.note.silent ? val : 0
    return el + input
  })
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

const feedbackCode = computed(() => `
  // uniform sampler2D u_mainOutput;

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 mainOutput = texture2D(u_mainOutput, uv);

    // Perform any operations on mainOutput as needed

    gl_FragColor = mainOutput;
  }
`);

</script>

<template lang='pug'>
.relative#screen.rounded-lg.overflow-hidden.pointer-events-auto.touch-revert()    
  button.absolute.z-200.text-2xl.top-2.right-2.opacity-30.hover-opacity-100.transition(
    v-tooltip="'Enable audio input'"
    v-if="!initiated" 
    @click="init();initiated=true;")
    .i-la-microphone
  gl-canvas(@update="glslUpdate" :key="debounced")
    gl-program(name="buffer0", :code="shaderCode")
      gl-float(name="u_light", :value="light")
      gl-mat4(name="u_notes", :value="notesMat4")
      gl-image(name="u_mainOutput", value="buffer1")
    gl-program(name="buffer1", :code="shaderCode")
      gl-float(name="u_light", :value="light")
      gl-mat4(name="u_notes", :value="notesMat4")
      gl-image(name="u_mainOutput", value="buffer0")
    gl-program(name="main" :code="feedbackCode")
      gl-image(name="u_mainOutput", value="buffer1")
</template>
