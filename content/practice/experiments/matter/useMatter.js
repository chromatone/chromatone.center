import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Render, Composite, Runner, Events, Engine, } from 'matter-js';
import { useResizeObserver } from '@vueuse/core';
import { useCircles } from './useCircles';
import { useCenter } from './useCenter';
import { useBoundaries } from './useBoundaries';


// import MatterAttractors from 'matter-attractors'
// use(MatterAttractors);
// MatterAttractors.Attractors.gravityConstant = 0.00005

//import MatterWrap from 'matter-wrap';
// Matter.use(MatterWrap);

export let engine;
export let renderer;

export const canvas = ref(null);
export const initiated = ref(false);
export const running = ref(false)
export const box = reactive({ w: 100, h: 100 })

export function useMatter() {

  const setupMatterJs = () => {
    engine = Engine.create();
    engine.gravity.scale = 0;

    renderer = Render.create({
      element: canvas.value,
      engine: engine,
      options: {
        width: box.w,
        height: box.h,
        background: "transparent",
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
        showAngleIndicator: true
      },
    });

    Runner.run(engine);
    Render.run(renderer);

    resizeBox()
    useResizeObserver(canvas, resizeBox)
  };

  const clearMatterJs = () => {
    Events.off(engine);
    Composite.clear(engine?.world);
    Engine.clear(engine);
    Render.stop(renderer);
    renderer?.canvas?.remove();
  };

  onMounted(() => {
    if (initiated.value) return;
    initiated.value = true;
    setupMatterJs();
    useCenter()
    useCircles()
    useBoundaries()
  });

  onBeforeUnmount(() => {
    clearMatterJs();
  });

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      clearMatterJs();
    });
  }

  return {
    canvas, initiated, running,
  };
}

/* RESIZE BOX */

function resizeBox() {
  const { width, height } = canvas.value.getBoundingClientRect();
  box.w = width
  box.h = height
  if (!renderer) return
  Render.setPixelRatio(renderer, window.devicePixelRatio);
  renderer.options.width = width;
  renderer.options.height = height;
  Render.lookAt(renderer, {
    min: { x: 0, y: 0 },
    max: { x: width, y: height },
  });
}
