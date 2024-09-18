<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import paper, { Group, Path, Point } from 'paper';
import { createNoise2D } from 'simplex-noise';
import { useData } from 'vitepress';

const { isDark } = useData()

const canvasRef = ref(null);
const noise = createNoise2D();

onMounted(() => {
  paper.setup(canvasRef.value);
  const view = paper.view;

  const groups = []

  for (let cir = 1; cir <= 3; cir++) {
    const group = new Group();
    for (let c = 1; c <= 30; c++) {
      group.addChild(new Path.Circle({
        center: view.center,
        radius: c * 20,
        strokeColor: 'black',
        strokeWidth: 1
      }));
    }
    groups.push(group)
  }

  watch(isDark, d => groups.forEach(group => group.strokeColor = d ? 'white' : 'black'), { immediate: true })

  view.onFrame = (event) => {
    const time = event.time;

    groups.forEach((group, g) => group.children.forEach((circle, index) => {
      const cir = Math.floor(index / 60) + 1;
      const c = (index % 30) + 1;
      const noise1 = noise(c / (50 * cir + time) + 10000 + g * 1000, cir * time / 40 + g * 1000);
      const noise2 = noise(c / (30 + cir + time) + g * 1000, cir * time / 40 + 100 + g * 1000);
      circle.position = view.center.add(new Point(400 * noise1, 400 * noise2))
    }))
  };
});

onUnmounted(() => {
  paper.project.clear();
});
</script>

<template lang="pug">
canvas.w-full.h-screen#screen(
  ref="canvasRef"
  resize
  :style="{ touchAction: 'none', userSelect: 'none' }"
  )
</template>