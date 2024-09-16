<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import paper, { Group, Path, Point } from 'paper';
import { createNoise2D } from 'simplex-noise';

const canvasRef = ref(null);
const noise = createNoise2D();

onMounted(() => {
  paper.setup(canvasRef.value);
  const view = paper.view;

  const createCircles = () => {
    const group = new Group();
    for (let cir = 1; cir <= 3; cir++) {
      for (let c = 1; c <= 60; c++) {
        const circle = new Path.Circle({
          center: view.center,
          radius: c * 20,
          strokeColor: 'black',
          strokeWidth: 1
        });
        group.addChild(circle);
      }
    }
    return group;
  };

  const circles = createCircles();

  view.onFrame = (event) => {
    const time = event.time;

    circles.children.forEach((circle, index) => {
      const cir = Math.floor(index / 60) + 1;
      const c = (index % 30) + 1;
      const noise1 = noise(c / (50 * cir + time) + 10000, cir * time / 40);
      const noise2 = noise(c / (30 + cir + time), cir * time / 40 + 100);
      circle.position = view.center.add(new Point(200 * noise1, 200 * noise2));
    });
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