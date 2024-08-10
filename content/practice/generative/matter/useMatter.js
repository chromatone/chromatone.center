import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Render, Composite, Runner, Events, Engine, Mouse, } from 'matter-js';
import { useResizeObserver } from '@vueuse/core';
import { useCircles } from './useCircles';
import { usePlayer } from './usePlayer';
import { useBoundaries } from './useBoundaries';
import { useStars } from './useStars';
import { useGrid } from './useGrid';
import { useNavigator } from './useNavigator';


//import MatterWrap from 'matter-wrap';
// Matter.use(MatterWrap);

export let engine;
export let render;
export let mouse;

export const canvas = ref(null);
export const initiated = ref(false);
export const running = ref(false)
export const box = reactive({ w: 100, h: 100 })
export const score = ref(0)
export const position = ref({ x: 0, y: 0 })

export function useMatter() {

  function setupMatterJs() {
    engine = Engine.create();
    engine.gravity.scale = 0;
    mouse = Mouse.create(canvas.value);

    render = Render.create({
      element: canvas.value,
      engine: engine,
      mouse,
      options: {
        width: box.w,
        height: box.h,
        background: "transparent",
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
        showAngleIndicator: true,
        hasBounds: true,
      },
    });

    Render.setPixelRatio(render, 'auto')

    const runner = Runner.create()
    Runner.run(runner, engine);
    Render.run(render);

    resizeBox()
    useResizeObserver(canvas, resizeBox)
  };

  const clearMatterJs = () => {
    Events.off(engine);
    Composite.clear(engine?.world);
    Engine.clear(engine);
    Render.stop(render);
    render?.canvas?.remove();
  };

  onMounted(() => {
    if (initiated.value) return;
    initiated.value = true;
    setupMatterJs();
    // useGrid()
    useStars()
    useCircles()

    // useBoundaries()
    const { player } = usePlayer()
    useNavigator(player)
    Events.on(engine, 'beforeUpdate', () => {
      updateMouse(engine, render);
      position.value.x = player.position.x - box.w / 2
      position.value.y = player.position.y - box.h / 2
    })
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
    canvas, initiated, running, score, position
  };
}

/* RESIZE BOX */

function resizeBox() {
  const { width, height } = canvas.value.getBoundingClientRect();
  box.w = width
  box.h = height
  if (!render) return
  Render.setPixelRatio(render, window.devicePixelRatio);
  render.options.width = width;
  render.options.height = height;
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: width, y: height },
  });
}

function updateMouse(render) {
  // console.log(render.bounds)
  // Mouse.setOffset(mouse, render.bounds?.min);
  // Mouse.setScale(mouse, {
  //   x: (render?.bounds.max.x - render?.bounds.min.x) / render.options.width,
  //   y: (render?.bounds.max.y - render?.bounds.min.y) / render.options.height,
  // });
};