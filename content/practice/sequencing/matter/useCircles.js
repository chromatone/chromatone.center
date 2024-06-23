
import { Body, Bodies, Composite, Events, Query, MouseConstraint, Composites, Common, Collision, World, } from 'matter-js';

import { midi, midiPlay, midiStop, playKey } from '#/use/midi';
import { Note } from 'tonal';
import { globalScale } from '#/use';
import { engine, canvas, box, running } from './useMatter';


export function useCircles() {
  const mouseControl = MouseConstraint.create(engine, {
    element: canvas.value,
    constraint: {
      render: { visible: true },
    },
  });


  Composite.add(engine.world, [mouseControl]);

  const hole = Bodies.circle(box.w / 2, box.h / 2, 20, {
    isSensor: true,
    isStatic: true,
    label: 'hole',
    render: {
      lineWidth: 10,
      strokeStyle: '#5558',
      fillStyle: 'transparent'
    },
  })

  Composite.add(engine.world, hole);

  const circles = Composites.stack();

  // Events.on(engine, 'afterUpdate', () => {
  //   circles.bodies.forEach(circle => {
  //     const forceX = box.w / 2 - circle.position.x;
  //     const forceY = box.h / 2 - circle.position.y;
  //     const strength = 0.01
  //     Body.applyForce(circle, circle.position, { x: forceX * strength, y: forceY * strength });
  //   })
  // })

  function createShape(x, y, note = globalScale.tonic + 45) {

    let noteName = Common.choose(globalScale.pcs) + Common.choose([2, 3, 4])

    note = Note.midi(noteName)

    const strokeStyle = `hsl(${((note + 3) % 12) * 30}deg, ${(note + 3)}%, 50%)`;

    const circle = Bodies.circle(x, y, (120 - note) / 2, {
      label: 'particle',
      frictionAir: 0.000001,
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
        // attractors: [
        //   MatterAttractors.Attractors.gravity
        // ],
        // wrap: {
        //   min: { x: 0, y: 0 },
        //   max: { x: box.w, y: box.h },
        // },
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
    running.value = true
  })

  Events.on(engine, 'collisionStart', (event) => {
    for (const pair of event.pairs) {
      const velocity = calculateAndLogCollisionForce(pair);
      for (let body of ['bodyA', 'bodyB']) {

        const hitBody = pair[body]
        const originalStyle = hitBody.render.strokeStyle;

        if (hitBody.label == 'hole') {

          let other = body == 'bodyA' ? pair['bodyB'] : pair['bodyA']
          if (other.label == 'particle') {
            World.remove(engine.world, other);
          }
        }

        // // if (hitBody.render.fillStyle != 'transparent') continue;
        // if (hitBody.data?.count !== undefined) {
        //   console.log(hitBody.data.count++)
        // }

        // if (hitBody?.label == 'particle') reduceRadius(hitBody);


        hitBody.render.fillStyle = originalStyle;
        const note = Note.fromMidi(pair[body].isStatic ? 33 + globalScale.tonic : hitBody.data?.note || 33 + globalScale.tonic)

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