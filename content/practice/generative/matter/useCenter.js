import { ref, watch } from 'vue';
import { Body, Bodies, Composite, Events, Vector, Render, Mouse, Constraint } from 'matter-js';
import { globalScale } from '#/use';
import { engine, box, running, render } from './useMatter';
import { pressedKeys, joystick } from './useControls'



export function useCenter() {

  const strokeStyle = `hsl(${globalScale.tonic * 30}deg, 50%, 50%)`

  const center = Bodies.polygon(box.w / 2, box.h / 2, 3, Math.min(20), {
    label: 'player',
    restitution: .95,
    friction: 0.4,
    frictionStatic: 0.001,
    density: 60,
    collisionFilter: {
      category: 0x0002,
      mask: 0x0004 | 0x0002
    },
    render: {
      lineWidth: 2,
      strokeStyle,
      fillStyle: 'transparent',
      visible: true,
    },
  });

  // Rocket engine (square) body
  const engineBody = Bodies.rectangle(center.position.x, center.position.y + 30, 10, 20, {
    label: 'engine',
    isStatic: false,
    collisionFilter: {
      category: 0x0002,
      mask: 0x0004
    },
    render: {
      lineWidth: 2,
      strokeStyle,
      fillStyle: 'transparent',
      visible: true,
    },
  });

  // Constraint to attach engine to main body
  const engineConstraint1 = Constraint.create({
    bodyA: center,
    bodyB: engineBody,
    pointA: { x: 10, y: -5 }, // Attach to the bottom center of the triangle
    pointB: { x: -10, y: -10 }, // Attach to the top center of the engine
    stiffness: 0.05,
    length: 1,
    render: {
      visible: false,
    },
  });

  const engineConstraint2 = Constraint.create({
    bodyA: center,
    bodyB: engineBody,
    pointA: { x: 10, y: 5 }, // Attach to the bottom center of the triangle
    pointB: { x: -10, y: 10 }, // Attach to the top center of the engine
    stiffness: 0.05,
    length: 1,
    render: {
      visible: false,
    },
  });

  Events.on(engine, 'afterUpdate', () => {

    const forceX = (box.w / 2 - center.position.x) / center.position.x;
    const forceY = (box.h / 2 - center.position.y) / center.position.y;
    const strength = 0.002
    Body.applyForce(center, center.position, { x: forceX * strength, y: forceY * strength });

  })

  Composite.add(engine?.world, [center, engineBody, engineConstraint1, engineConstraint2]);

  const steer = 0.07
  const thrust = 10;

  const handleControl = () => {

    let acc = pressedKeys.ArrowUp ? -thrust : (pressedKeys.ArrowDown ? thrust : 0);

    acc -= joystick.y * thrust

    Body.setAngularVelocity(center, pressedKeys.ArrowLeft ? -steer : (pressedKeys.ArrowRight ? steer : 0) + joystick.x * steer)

    const force = Vector.create(Math.cos(center.angle) * acc, Math.sin(center.angle) * acc)

    Body.applyForce(center, center.position, force);

    Render.lookAt(render, center.position, { x: box.w / 2, y: box.h / 2 });
  };

  // Create Matter engine, world, circle, and renderer (same as before)

  Events.on(engine, 'beforeUpdate', handleControl);





  return {
    running,
    center
  }
}