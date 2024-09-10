<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useElementary } from "#/use/elem/useElementary";

const props = defineProps({
  name: { default: 'synth', type: String },
  color: { default: 'currentColor', type: String },
  triggerLevel: { default: 0, type: Number },
});

const { scopes } = useElementary();

const canvas = ref(null);
let animationFrameId = null;

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = canvas.value.clientWidth;
    canvas.value.height = canvas.value.clientHeight;
  }
  startAnimation();
});

onUnmounted(() => {
  stopAnimation();
});

function startAnimation() {
  animationFrameId = requestAnimationFrame(draw);
}

function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

function findTriggerIndex(data, triggerLevel) {
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i] <= triggerLevel && data[i + 1] > triggerLevel) {
      return i;
    }
  }
  return 0;
}

function draw() {
  const ctx = canvas.value.getContext('2d');
  const { width, height } = canvas.value;
  const samples = scopes[props.name];

  if (!samples || samples.length < 2) {
    animationFrameId = requestAnimationFrame(draw);
    return;
  }

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = props.color;
  ctx.lineWidth = 3;

  const triggerIndex = findTriggerIndex(samples, props.triggerLevel);
  const step = width / samples.length;

  ctx.beginPath();
  for (let i = 0; i < samples.length; i++) {
    const x = i * step;
    const sampleIndex = (triggerIndex + i) % samples.length;
    const y = (1 - samples[sampleIndex]) * height / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  animationFrameId = requestAnimationFrame(draw);
}
</script>

<template lang="pug">
canvas.w-full.h-full(ref="canvas")
</template>