import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue';
import Matter, { Render, Body, Bodies, World, Runner, Events, Engine, Query, MouseConstraint, Composites, Common, Vector } from 'matter-js';
import { useResizeObserver } from '@vueuse/core';
import MatterWrap from 'matter-wrap';
import { midi } from '#/use/midi';
import { synthOnce } from '#/use';
import { Note } from 'tonal';

Matter.use(MatterWrap);

export const settings = reactive({
  friction: 0.008,
  bounce: 0.98,
});

let engine;
let renderer;

const canvas = ref(null);
const initiated = ref(false);
const box = reactive({ w: 100, h: 100 })

export function useMatter() {

  const setupMatterJs = () => {
    resizeBox()
    useResizeObserver(canvas, resizeBox)

    engine = Engine.create();
    engine.gravity.scale = 0.0001;
    engine.gravity.x = 0;
    engine.gravity.y = 1;

    renderer = Render.create({
      element: canvas.value,
      engine: engine,
      options: {
        width: box.w,
        height: box.h,
        background: "transparent",
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
      },
    });

    Runner.run(engine);
    Render.run(renderer);

    const createShape = (x, y, note = Math.floor(Common.random(50, 100))) => {
      const fillStyle = `hsl(${((note + 3) % 12) * 30}deg, 50%, 50%)`;
      const circle = Bodies.circle(x, y, 25, {
        frictionAir: settings.friction * Math.random(),
        restitution: settings.bounce,
        render: { fillStyle },
        plugin: {
          wrap: {
            min: { x: 0, y: 0 },
            max: { x: box.w, y: box.h },
          },
        },
      });
      circle.data = { note };
      return circle;
    };

    const mouseControl = MouseConstraint.create(engine, {
      element: canvas.value,
      constraint: {
        render: { visible: false },
      },
    });

    const circles = Composites.stack();

    World.add(engine.world, [mouseControl]);

    Events.on(mouseControl, 'mousemove', ({ mouse }) => {
      const hoveredShapes = Query.point(circles.bodies, mouse.position);
      hoveredShapes.forEach((shape) => { shape.scale = 1.1; });
    });

    Events.on(mouseControl, 'mousedown', ({ mouse }) => {
      const shape = createShape(mouse.position.x, mouse.position.y);
      circles.bodies.push(shape);
      World.add(engine.world, shape);
    });

    watch(() => midi.note, (note) => {
      if (!note.velocity) return;
      const shape = createShape(box.w * Math.random(), box.h * Math.random(), note.number);
      Body.setVelocity(shape, Vector.create(Common.random(-10, 10), Common.random(-10, 10)));
      circles.bodies.push(shape);
      World.add(engine.world, shape);
    });

    Events.on(engine, 'collisionStart', (event) => {
      for (const pair of event.pairs) {
        for (let body of ['bodyA', 'bodyB']) {
          if (!pair[body]?.data) continue
          const hitBody = pair[body]
          const originalStyle = hitBody.render.fillStyle;
          if (originalStyle == 'black') continue;

          hitBody.render.fillStyle = 'black';
          synthOnce(Note.fromMidi(hitBody.data?.note));
          setTimeout(() => {
            hitBody.render.fillStyle = originalStyle || 'black';
          }, 10);
        }

      }
    });

  };

  const clearMatterJs = () => {
    Events.off(engine);
    World.clear(engine?.world);
    Engine.clear(engine);
    Render.stop(renderer);
    renderer?.canvas?.remove();
  };

  onMounted(() => {
    if (initiated.value) return;
    initiated.value = true;
    setupMatterJs();
    useCenter()
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
    canvas,
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


/* CENTER SHAPE */

function useCenter() {
  const running = ref(true)
  const center = Bodies.polygon(box.w / 2, box.h / 2, 3, Math.min(box.w / 4, box.h / 4), {
    isStatic: true,
    render: {
      lineWidth: 0,
      strokeStyle: 'yellow',
      fillStyle: 'yellow',
      visible: true,
    },
  });

  World.add(engine?.world, [center]);

  watch(box, ({ w, h }) => {
    Body.setPosition(center, { x: w / 2, y: h / 2 });
  })

  let time = 0;
  const updateGravity = () => {
    time += 0.001;
    Body.rotate(center, 0.01);
    if (!running.value) return
    requestAnimationFrame(updateGravity);
  };
  updateGravity();

  return {
    running,
    center
  }
}