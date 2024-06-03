import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Render, Body, Bodies, Composite, Runner, Events, Engine, Query, MouseConstraint, Composites, Common, Collision, World } from 'matter-js';
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

    const circle = Bodies.circle(x, y, (120 - note) / 2, {
      label: 'particle',
      frictionAir: 0.00001,
      friction: 0.4,
      frictionStatic: 0.001,
      density: 10,
      restitution: .8,
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
  })

  Events.on(mouseControl, 'mousedown', ({ mouse }) => {
    const hoveredShapes = Query.point(circles.bodies, mouse.position);
    if (hoveredShapes.length > 0) return
    const shape = createShape(mouse.position.x, mouse.position.y);
    circles.bodies.push(shape);
    Composite.add(engine.world, shape);
  })

  Events.on(engine, 'collisionStart', (event) => {
    for (const pair of event.pairs) {
      const velocity = calculateAndLogCollisionForce(pair);
      for (let body of ['bodyA', 'bodyB']) {

        const hitBody = pair[body]
        const originalStyle = hitBody.render.strokeStyle;

        // // if (hitBody.render.fillStyle != 'transparent') continue;
        // if (hitBody.data?.count !== undefined) {
        //   console.log(hitBody.data.count++)
        // }

        if (hitBody?.label == 'particle') reduceRadius(hitBody);


        hitBody.render.fillStyle = originalStyle;
        const note = Note.fromMidi(pair[body].isStatic ? 33 + globalScale.tonic : hitBody.data?.note)

        setTimeout(() => {
          playKey(note.slice(0, -1), parseInt(note.slice(-1)) - 4, false, velocity, 0.5)
          midiPlay(hitBody.data?.note || 33 + globalScale.tonic, {
            attack: velocity
          })
        }, 2)


        setTimeout(() => {
          hitBody.render.fillStyle = 'transparent'
          playKey(note.slice(0, -1), parseInt(note.slice(-1)) - 4, true)
          midiStop(hitBody.data?.note || 33 + globalScale.tonic)
        }, 30);
      }

    }
  })

  return {
    circles
  }
}

function reduceRadius(body) {
  if (body?.circleRadius <= 3) { // Arbitrary threshold for removal
    // Remove the body from the world
    World.remove(engine.world, body);
    console.log('Body removed:', body);
  } else {

    Body.scale(body, .98, .98)
    Body.update(body);
  }
}


function calculateAndLogCollisionForce(pair) {
  const bodyA = pair.bodyA
  const bodyB = pair.bodyB

  // Detect collision between bodyA and bodyB
  const collision = Collision.collides(bodyA, bodyB);

  if (collision) {
    // Extract collision properties
    const normal = collision.normal;
    const penetrationDepth = collision.depth;

    const relativeVelocity = {
      x: bodyB.velocity.x - bodyA.velocity.x,
      y: bodyB.velocity.y - bodyA.velocity.y
    };
    const velocityAlongNormal = relativeVelocity.x * normal.x + relativeVelocity.y * normal.y;

    const e = .6; // Coefficient of restitution
    const impulseScalar = -(1 + e) * velocityAlongNormal / (1 / bodyA.mass + 1 / bodyB.mass);

    const impulse = {
      x: impulseScalar * normal.x,
      y: impulseScalar * normal.y
    };

    const collisionTime = 0.02;
    const collisionForce = {
      x: impulse.x / collisionTime,
      y: impulse.y / collisionTime
    };

    const absoluteCollisionForce = Math.sqrt(collisionForce.x ** 2 + collisionForce.y ** 2);

    const logForce = Math.log(absoluteCollisionForce);

    function sigmoid(x, a, b) {
      return 1 / (1 + Math.exp(-a * (x - b)));
    }

    const a = 1; // Controls the steepness of the curve
    const b = 14; // Controls the midpoint of the curve

    const normalizedForce = sigmoid(logForce, a, b);

    return normalizedForce
  } else {
    console.log('No collision detected between the bodies.');
  }
}


/* CENTER SHAPE */

function useCenter() {

  const strokeStyle = `hsl(${globalScale.tonic * 30}deg, 50%, 50%)`

  const center = Bodies.circle(box.w / 2, box.h / 2, Math.min(box.w / 20, box.h / 20), {
    isStatic: true,
    label: 'particle',
    restitution: .3,
    friction: 0.4,
    frictionStatic: 0.001,
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


  // let time = 0;
  // Events.on(engine, 'afterUpdate', () => {
  //   time += 0.001;
  //   Body.rotate(center, 0.05);
  // })


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
      restitution: 0.6,
      friction: 0.4,
      frictionStatic: 0.001,
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

