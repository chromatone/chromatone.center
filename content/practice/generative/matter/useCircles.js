
import { Body, Bodies, Composite, Events, Query, MouseConstraint, Composites, Common, Collision, Constraint } from 'matter-js';
import { midi, midiPlay, midiStop, playKey } from '#/use/midi';
import { Note } from 'tonal';
import { globalScale } from '#/use';
import { engine, canvas, box, running, mouse, score } from './useMatter';
import { setTimeout } from 'worker-timers';
import { onKeyDown } from '@vueuse/core';
import { watch } from 'vue';

let isDragging = false;
let draggedBody = null;

export function useCircles() {
  const mouseControl = MouseConstraint.create(engine, {
    mouse,
    element: canvas.value,
    collisionFilter: -1,
  });

  onKeyDown('Enter', () => {
    const train = engine.world.constraints.find(body => body.label === 'train');
    if (!train) return
    train.bodyA.data.constraint = null
    train.bodyB.data.constraint = null
    Composite.remove(engine.world, train)
  })

  // watch(() => midi.note, note => {
  //   const shape = createShape(mouse.position.x, mouse.position.y, note?.pitch + 57 || note);
  //   circles.bodies.push(shape);
  //   Composite.add(engine.world, shape);
  // })

  Composite.add(engine.world, [mouseControl]);

  const hole = Bodies.circle(0, 0, 40, {
    isStatic: true,
    label: 'hole',
    collisionFilter: {
      category: 0x0008,
      mask: 0x0004 | 0x0002
    },
    render: {
      lineWidth: 10,
      strokeStyle: '#5558',
      fillStyle: '#111'
    },
  });

  Composite.add(engine.world, hole);

  const circles = Composites.stack();

  const G = 6.67430; // Gravitational constant
  const centerMass = 10; // Mass of the central body (black hole)

  Events.on(engine, 'afterUpdate', () => {
    circles.bodies.forEach(gravitate);
    gravitate(engine.world.bodies.find(b => b.label == 'player'))

    function gravitate(body) {
      if (!body) return
      const dx = -body.position.x;
      const dy = -body.position.y;
      const distanceSquared = dx * dx + dy * dy;
      const distance = Math.sqrt(distanceSquared);

      // Newton's law of universal gravitation
      const forceMagnitude = G * centerMass * body.mass / distanceSquared;

      const forceX = forceMagnitude * dx / distance;
      const forceY = forceMagnitude * dy / distance;

      Body.applyForce(body, body.position, { x: forceX, y: forceY });
    }
  });


  function createShape(x, y, note = globalScale.tonic + 45) {

    const strokeStyle = `hsl(${((note + 3) % 12) * 30}deg, ${(note + 3)}%, 50%)`;

    const circle = Bodies.circle(x, y, (120 - note) / 4, {
      label: 'particle',
      frictionAir: 0.03,
      friction: 0.4,
      frictionStatic: 0.001,
      density: 1,
      restitution: .8,
      render: {
        lineWidth: 2,
        strokeStyle,
        fillStyle: 'transparent'
      },
      collisionFilter: {
        category: 0x0004,
        mask: 0x0004 | 0x0008 | 0x0002
      },
    });

    circle.data = { note, constraint: null };

    return circle;
  }

  Events.on(mouseControl, 'mousemove', ({ mouse }) => {
    if (isDragging && draggedBody) {
      const dx = mouse.position.x - draggedBody.position.x;
      const dy = mouse.position.y - draggedBody.position.y;

      const forceMagnitude = 0.1;
      Body.applyForce(draggedBody, draggedBody.position, {
        x: dx * forceMagnitude,
        y: dy * forceMagnitude
      });
    }
  });

  Events.on(mouseControl, 'mousedown', ({ mouse }) => {
    const hoveredShapes = Query.point(circles.bodies, mouse.position);
    if (hoveredShapes.length > 0) {
      isDragging = true;
      draggedBody = hoveredShapes[0];
      return;
    }
    let noteName = Common.choose(globalScale.pcs) + Common.choose([2, 3, 4, 5]);
    let note = Note.midi(noteName);
    const shape = createShape(mouse.position.x, mouse.position.y, note || midi?.note?.pitch + 69);
    circles.bodies.push(shape);
    Composite.add(engine.world, shape);
    running.value = true;
    isDragging = true;
    draggedBody = shape;

  });

  Events.on(mouseControl, 'mouseup', () => {
    isDragging = false;
    draggedBody = null;
  });

  Events.on(engine, 'collisionStart', (event) => {
    for (const pair of event.pairs) {
      const velocity = calculateAndLogCollisionForce(pair);
      for (let body of ['bodyA', 'bodyB']) {
        const hitBody = pair[body];
        let other = body === 'bodyA' ? pair['bodyB'] : pair['bodyA'];
        const originalStyle = hitBody.render.strokeStyle;

        if (hitBody.label === 'engine' && other.label === 'particle') {
          if (!hitBody.data?.constraint && !other.data?.constraint) {
            const engineConstraint = Constraint.create({
              label: `train`,
              bodyA: hitBody,
              bodyB: other,
              stiffness: .8,
              length: 20,
              render: {
                visible: false,
              },
              pointA: { x: 0, y: 0 },
              pointB: { x: 0, y: 0 },
            });
            Composite.add(engine?.world, [engineConstraint]);
            hitBody.data = { ...hitBody.data, constraint: engineConstraint };
            other.data = { ...other.data, constraint: engineConstraint };
          }
        }

        if (hitBody.label === 'hole') {
          if (other.label === 'particle') {
            if (other.data?.constraint) {
              Composite.remove(engine.world, other.data.constraint);
              const connectedBody = other.data.constraint.bodyA === other ? other.data.constraint.bodyB : other.data.constraint.bodyA;
              connectedBody.data.constraint = null;
            }
            Composite.remove(engine.world, other);
            score.value++;
          }
        }

        if (!['hole', 'wall'].includes(hitBody.label)) {
          hitBody.render.fillStyle = originalStyle;
        }

        const note = Note.fromMidi(pair[body].isStatic ? 33 + globalScale.tonic : hitBody.data?.note || 33 + globalScale.tonic);

        setTimeout(() => {
          playKey(note.slice(0, -1), parseInt(note.slice(-1)) - 4, false, velocity, 0.5);
          midiPlay(hitBody.data?.note || 33 + globalScale.tonic, {
            attack: velocity
          });
        }, 2);

        setTimeout(() => {
          if (!['hole', 'wall'].includes(hitBody.label)) {
            hitBody.render.fillStyle = 'transparent';
          }

          playKey(note.slice(0, -1), parseInt(note.slice(-1)) - 4, true);
          midiStop(hitBody.data?.note || 33 + globalScale.tonic);
        }, 50);
      }
    }
  });

  return {
    circles
  };
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
    const b = 8; // Controls the midpoint of the curve

    const normalizedForce = sigmoid(logForce, a, b);

    return normalizedForce
  } else {
    console.log('No collision detected between the bodies.');
  }
}