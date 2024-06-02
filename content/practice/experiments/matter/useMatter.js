import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Render, Body, Bodies, Composite, Runner, Events, Engine, Query, MouseConstraint, Composites, Common } from 'matter-js';
import { useResizeObserver } from '@vueuse/core';

import { midi, midiPlay, midiStop, playKey } from '#/use/midi';
import { Note } from 'tonal';
import { globalScale } from '#/use';


//import MatterWrap from 'matter-wrap';
// Matter.use(MatterWrap);

export let engine;
let renderer;

const canvas = ref(null);
const initiated = ref(false);
const running = ref(false)
const box = reactive({ w: 100, h: 100 })

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
    const { center } = useCenter()
    const { circles } = useCircles()
    const { generateBoundaries } = useBoundaries()

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

/* Circles */

function useCircles() {
  const mouseControl = MouseConstraint.create(engine, {
    element: canvas.value,
    constraint: {
      render: { visible: false },
    },
  });

  Composite.add(engine.world, [mouseControl]);

  const circles = Composites.stack();

  Events.on(engine, 'afterUpdate', () => {
    circles.bodies.forEach(circle => {
      const forceX = box.w / 2 - circle.position.x;
      const forceY = box.h / 2 - circle.position.y;
      const strength = 0.01
      Body.applyForce(circle, circle.position, { x: forceX * strength, y: forceY * strength });
    })
  })

  function createShape(x, y, note = globalScale.tonic + 45) {

    let noteName = Common.choose(globalScale.pcs) + Common.choose([2, 3, 4])

    note = Note.midi(noteName)

    const strokeStyle = `hsl(${((note + 3) % 12) * 30}deg, ${(note + 3)}%, 50%)`;

    const circle = Bodies.circle(x, y, (120 - note) / 4, {
      frictionAir: 0,
      density: 10,
      restitution: 1,
      render: {
        lineWidth: 2,
        strokeStyle,
        fillStyle: 'transparent'
      },
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

  Events.on(mouseControl, 'mousemove', ({ mouse }) => {
    const hoveredShapes = Query.point(circles.bodies, mouse.position);
    hoveredShapes.forEach((shape) => { shape.scale = 1.1; });
  });

  Events.on(mouseControl, 'mousedown', ({ mouse }) => {
    const hoveredShapes = Query.point(circles.bodies, mouse.position);
    if (hoveredShapes.length > 0) return
    const shape = createShape(mouse.position.x, mouse.position.y);
    circles.bodies.push(shape);
    Composite.add(engine.world, shape);
  });

  Events.on(engine, 'collisionStart', (event) => {
    for (const pair of event.pairs) {
      for (let body of ['bodyA', 'bodyB']) {

        const hitBody = pair[body]
        const originalStyle = hitBody.render.strokeStyle;

        // if (hitBody.render.fillStyle != 'transparent') continue;

        hitBody.render.fillStyle = originalStyle;
        const note = Note.fromMidi(pair[body].isStatic ? 33 + globalScale.tonic : hitBody.data?.note)

        setTimeout(() => {
          playKey(note.slice(0, -1), parseInt(note.slice(-1)) - 4, false, 1, 0.5)
          midiPlay(hitBody.data?.note || 33 + globalScale.tonic)
        }, 2)


        setTimeout(() => {
          hitBody.render.fillStyle = 'transparent'
          playKey(note.slice(0, -1), parseInt(note.slice(-1)) - 4, true)
          midiStop(hitBody.data?.note || 33 + globalScale.tonic)
        }, 30);
      }

    }
  });

  return {
    circles
  }
}


/* CENTER SHAPE */

function useCenter() {

  const strokeStyle = `hsl(${globalScale.tonic * 30}deg, 50%, 50%)`

  const center = Bodies.polygon(box.w / 2, box.h / 2, 4, Math.min(box.w / 20, box.h / 20), {
    isStatic: true,
    restitution: 1,
    render: {
      lineWidth: 2,
      strokeStyle,
      fillStyle: 'transparent',
      visible: true,
    },
  });

  Composite.add(engine?.world, [center]);

  watch(box, ({ w, h }) => {
    Body.setPosition(center, { x: w / 2, y: h / 2 });
  })


  let time = 0;
  Events.on(engine, 'afterUpdate', () => {
    time += 0.001;
    Body.rotate(center, 0.05);
  })


  return {
    running,
    center
  }
}


//* Boundaries */

export function useBoundaries() {

  var walls = 0x0001
  const bThickness = 300
  let ground, ceiling, leftWall, rightWall;

  function generateBoundaries(w, h) {

    const wallOptions = {
      isStatic: true,
      render: {
        visible: true
      },
      collisionFilter: {
        category: walls,
      },
    };
    ground = Bodies.rectangle(w / 2, h + bThickness / 2, w + 2 * bThickness, bThickness, wallOptions);
    ceiling = Bodies.rectangle(w / 2, -50, w + 100, 100, wallOptions);
    leftWall = Bodies.rectangle(-50, h / 2, 100, h + 100, wallOptions);
    rightWall = Bodies.rectangle(w + 50, h / 2, 100, h + 100, wallOptions);


    Composite.add(engine.world, [
      ground,
      ceiling,
      leftWall,
      rightWall,
    ]);
  }

  function generateVertices(type, width, height) {
    switch (type) {
      case 'ground':
        return [
          { x: -width / 2, y: height },
          { x: width + width / 2, y: height },
          { x: width + width / 2, y: height + 2 * bThickness },
          { x: -width / 2, y: height + 2 * bThickness }
        ];
      case 'ceiling':
        return [
          { x: -width / 2, y: -bThickness },
          { x: width + width / 2, y: -bThickness },
          { x: width + width / 2, y: bThickness },
          { x: -width / 2, y: bThickness }
        ];
      case 'leftWall':
        return [
          { x: -bThickness, y: -height / 2 },
          { x: bThickness, y: -height / 2 },
          { x: bThickness, y: height + height / 2 },
          { x: -bThickness, y: height + height / 2 }
        ];
      case 'rightWall':
        return [
          { x: width - bThickness, y: -height / 2 },
          { x: width + bThickness, y: -height / 2 },
          { x: width + bThickness, y: height + height / 2 },
          { x: width - bThickness, y: height + height / 2 }
        ];
      default:
        return [];
    }
  }

  function setBoundary(boundary, type, width, height) {
    const position = {
      ground: { x: width / 2, y: height + bThickness },
      ceiling: { x: width / 2, y: -bThickness },
      leftWall: { x: -bThickness, y: height / 2 },
      rightWall: { x: width + bThickness, y: height / 2 }
    }[type];

    const vertices = generateVertices(type, width, height, bThickness);

    Body.setPosition(boundary, position);
    Body.setVertices(boundary, vertices);
  }

  function updateBoundaries(width, height) {
    setBoundary(ground, 'ground', width, height, bThickness);
    setBoundary(ceiling, 'ceiling', width, height, bThickness);
    setBoundary(leftWall, 'leftWall', width, height, bThickness);
    setBoundary(rightWall, 'rightWall', width, height, bThickness);
  }


  generateBoundaries(box.w, box.h)
  watch(box, b => updateBoundaries(b.w, b.h))

  return {
    generateBoundaries,
    updateBoundaries,
    setBoundary,
    generateVertices,
  }
}

