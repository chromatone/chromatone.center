<script setup>
import { ref, onMounted, watch } from 'vue';
import { useFFT } from '#/use/elem/useElementary'

const props = defineProps({
  name: { default: 'main:fft', type: String }
})

const FFT = useFFT(props.name)

let canvas = ref(null);

onMounted(draw);
watch(FFT, draw, { deep: true });

function draw() {
  if (!canvas.value || !FFT?.total) return;

  let context = canvas.value.getContext('2d');
  context.clearRect(0, 0, canvas.value.width, canvas.value.height);

  for (let i = 0; i < FFT.total.length; i++) {
    let value = FFT.total[i];
    let barHeight = Math.pow(value, 2) * canvas.value.height / 50;
    let x = Math.log2(i + 1) * canvas.value.width / Math.log2(FFT.total.length + 1);
    let nextX = Math.log2(i + 2) * canvas.value.width / Math.log2(FFT.total.length + 1);
    let barWidth = nextX - x;
    let y = canvas.value.height - barHeight;
    context.fillStyle = FFT.colors[i];
    context.fillRect(x, y, barWidth, barHeight);
  }
}
</script>

<template lang='pug'>
canvas.max-w-full(
  ref="canvas" 
  height="512"
  width="2048")
</template>
