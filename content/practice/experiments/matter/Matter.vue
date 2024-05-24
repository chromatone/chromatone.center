<script setup>
import { Render, Body, Bodies, World, Runner } from 'matter-js'
import { onMounted, ref } from 'vue';

import { generateBoundaries } from './boundaries';
import { initEngine, engine } from './engine';
import { initMouse } from './mouse';
import { useResizeObserver, useThrottleFn } from '@vueuse/core';


const canvas = ref()
const initiated = ref(false)

onMounted(() => {
  if (initiated.value) return
  initiated.value = true

  const box = canvas.value.getBoundingClientRect()
  let w = box.width;
  let h = box.height;

  initEngine(canvas, w, h)

  generateBoundaries(w, h)

  initMouse(canvas)

  const staticObj = Bodies.polygon(w / 2, h / 2, 3, Math.min(w / 2, h / 2), {
    isStatic: true,
    render: {
      lineWidth: 0,
      strokeStyle: 'yellow',
      fillStyle: "yellow",
      visible: true
    }
  });

  World.add(engine.world, [
    staticObj
  ]);

  useResizeObserver(canvas, useThrottleFn((entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect
    Body.setPosition(staticObj, { x: width / 2, y: height / 2 })

  }, 100, true));

  // Add time-dependent gravity
  let time = 0;
  const changeGravity = function () {
    time = time + 0.005;
    engine.world.gravity.scale = 0.002 * Math.sin(time / 20);
    engine.world.gravity.x = Math.sin(time);
    engine.world.gravity.y = Math.cos(time * 2);
    Body.rotate(staticObj, 0.008)

    requestAnimationFrame(changeGravity);
  };

  changeGravity();
})

</script>

<template lang='pug'>
section.w-full.h-100svh(ref="canvas")
</template>
