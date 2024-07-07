<script setup>
import { ref, onMounted } from 'vue';

import Hydra from 'hydra-synth'

const canvas = ref()
let hydra

const code = ref(`osc(60, -0.015, 0.3).diff(osc(60, 0.08).rotate(Math.PI / 2))
    .modulateScale(noise(3.5, 0.25).modulateScale(osc(15).rotate(() => Math.sin(time / 2))), 0.6)
    .color(1, 0.5, 0.4).contrast(1.4)
    .add(src(o0).modulate(o0, .04), .6)
    .invert().brightness(0.1).contrast(1.2)
    .modulateScale(osc(2), -0.2)
    .out()`)

onMounted(() => {

  hydra = new Hydra({
    detectAudio: false,
    canvas: canvas.value,
    width: 2000,
    height: 2000,
  })


  hydra.eval(code.value)

  src(o0).out(o1);

  render(o1);

})

</script>

<template lang='pug'>
canvas.w-full.max-h-100svh.min-h-100svh(width="1000" height="1000"  ref="canvas")
button.text-button(@click="hydra.eval(code)") Evaluate code
textarea.p-4.min-h-100.m-4.border-2.shadow-xl.rounded-xl(v-model="code") 
</template>