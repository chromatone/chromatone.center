import { onBeforeUnmount, onMounted, reactive, ref, shallowReactive, watch } from 'vue';
import Matter, { Engine, Render, Body, Bodies, World, MouseConstraint, Composites, Query, Runner } from 'matter-js'
import { useResizeObserver } from '@vueuse/core'
import { useThrottleFn } from '@vueuse/core'
import { updateBoundaries } from './boundaries';
import MatterWrap from 'matter-wrap'
export let engine
export let renderer

export function initEngine(canvas) {

  Matter.use(MatterWrap)

  const box = canvas.value.getBoundingClientRect()
  let w = box.width;
  let h = box.height;
  engine = Engine.create()
  renderer = Render.create({
    element: canvas.value,
    engine: engine,
    options: {
      width: w,
      height: h,
      background: "transparent",
      wireframes: false,
      pixelRatio: window.devicePixelRatio
    }
  })

  Runner.run(engine);
  Render.run(renderer);

  onBeforeUnmount(() => {
    Engine.clear(engine)
    World.clear(engine.world)
    Render.stop(renderer);
    renderer.canvas.remove();
  })

  useResizeObserver(canvas, useThrottleFn((entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect
    Render.setPixelRatio(renderer, window.devicePixelRatio);
    renderer.options.width = width;
    renderer.options.height = height;

    Render.lookAt(renderer, {
      min: { x: 0, y: 0 },
      max: { x: width, y: height }
    });

    // updateBoundaries(width, height);

  }, 100, true));
}