<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  fft: { default: {}, type: Object }
})

let canvas = ref(null);

onMounted(draw);
watch(() => props.fft, draw, { deep: true });

function draw() {
  if (!canvas.value || !props.fft?.total) return;

  let context = canvas.value.getContext('2d');
  context.clearRect(0, 0, canvas.value.width, canvas.value.height);

  for (let i = 0; i < props.fft.total.length; i++) {
    let value = props.fft.total[i];
    let barHeight = Math.pow(value, 2) * canvas.value.height / 50;
    let x = Math.log2(i + 1) * canvas.value.width / Math.log2(props.fft.total.length + 1);
    let nextX = Math.log2(i + 2) * canvas.value.width / Math.log2(props.fft.total.length + 1);
    let barWidth = nextX - x;
    let y = canvas.value.height - barHeight;
    context.fillStyle = props.fft.colors[i];
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
