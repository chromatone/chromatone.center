<template lang='pug'>
.flex.is-group.p-2.bg-light-200.dark-bg-dark-200.shadow.rounded.gap-4
  canvas.max-h-30.max-w-full(ref="canvas" width="2048")
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useFFT } from './useFFT';

const props = defineProps({
  name: { default: 'main:fft', type: String }
})

const { FFT } = useFFT(props.name)

let canvas = ref(null);

onMounted(draw);
watch(FFT, draw, { deep: true });

function draw() {
  if (!canvas.value || !FFT?.total) return;

  let context = canvas.value.getContext('2d');
  context.clearRect(0, 0, canvas.value.width, canvas.value.height);

  for (let i = 0; i < FFT.total.length; i++) {
    let value = FFT.total[i];
    let barHeight = value * 20 * canvas.value.height / 100;
    let x = Math.log2(i + 1) * canvas.value.width / Math.log2(FFT.total.length + 1);
    let nextX = Math.log2(i + 2) * canvas.value.width / Math.log2(FFT.total.length + 1);
    let barWidth = nextX - x;
    let y = canvas.value.height - barHeight;
    context.fillStyle = FFT.colors[i];
    context.fillRect(x, y, barWidth, barHeight);
  }
}
</script>
