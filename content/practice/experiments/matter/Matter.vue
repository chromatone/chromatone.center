<script setup>
import { Render, Body, Bodies, World, Runner, Events } from 'matter-js'
import { onMounted, ref } from 'vue';

// import { generateBoundaries } from './boundaries';
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

  initEngine(canvas)

  // generateBoundaries(w, h)

  initMouse(canvas)

  const staticObj = Bodies.polygon(w / 2, h / 2, 3, Math.min(w / 4, h / 4), {
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

  Events.on(engine, 'collisionStart', function (event) {
    for (const pair of event.pairs) {
      const hitBody = pair.bodyA !== engine.world.gravity ? pair.bodyA : pair.bodyB;
      // Optional: Store original style if needed
      const originalStyle = hitBody.render.fillStyle;

      console.log(hitBody.pitch)

      if (originalStyle == 'black') continue

      // Set white fill style for blink effect
      hitBody.render.fillStyle = 'black';

      // Timer to restore original style after 30ms
      setTimeout(function () {
        hitBody.render.fillStyle = originalStyle || 'black'; // Restore original or default black
      }, 10);
    }
  });

  useResizeObserver(canvas, useThrottleFn((entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect
    Body.setPosition(staticObj, { x: width / 2, y: height / 2 })

  }, 100, true));

  // Add time-dependent gravity
  let time = 0;
  const changeGravity = function () {
    time = time + 0.005;
    engine.world.gravity.scale = 0.0001 * Math.sin(time / 20);
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
