import { ref, watch } from 'vue';
import { Body, Bodies, Composite, Events, Vector, Render, Mouse, Constraint } from 'matter-js';
import { globalScale } from '#/use';
import { engine, box, running, render } from './useMatter';
import { pressedKeys, joystick } from './useControls'

export function usePlayer() {

  const strokeStyle = `hsl(${globalScale.tonic * 30}deg, 50%, 50%)`

  const player = Bodies.polygon(box.w / 2, box.h / 2, 3, Math.min(20), {
    label: 'player',
    frictionAir: 0.03,
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
  const engineBody = Bodies.rectangle(player.position.x, player.position.y + 30, 10, 20, {
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

  const constraintOptions = {
    bodyA: player,
    bodyB: engineBody,
    stiffness: 0.5,
    length: 2,
    render: {
      visible: false,
    },
  }

  // Constraint to attach engine to main body
  const engineConstraint1 = Constraint.create({
    ...constraintOptions,
    pointA: { x: 10, y: -5 },
    pointB: { x: -10, y: -10 },
  });

  const engineConstraint2 = Constraint.create({
    ...constraintOptions,
    pointA: { x: 10, y: 5 },
    pointB: { x: -10, y: 10 },
  });

  Events.on(engine, 'afterUpdate', () => {

    const forceX = (box.w / 2 - player.position.x) / player.position.x;
    const forceY = (box.h / 2 - player.position.y) / player.position.y;
    const strength = 0.002
    Body.applyForce(player, player.position, { x: forceX * strength, y: forceY * strength });

  })

  Composite.add(engine?.world, [player, engineBody, engineConstraint1, engineConstraint2]);

  const steer = 0.05
  const thrust = 30;

  const handleControl = () => {

    let acc = pressedKeys.ArrowUp ? -thrust : (pressedKeys.ArrowDown ? thrust : 0);

    acc -= joystick.y * thrust

    Body.setAngularVelocity(player, pressedKeys.ArrowLeft ? -steer : (pressedKeys.ArrowRight ? steer : 0) + joystick.x * steer)

    const force = Vector.create(Math.cos(player.angle) * acc, Math.sin(player.angle) * acc)

    Body.applyForce(player, player.position, force);

    Render.lookAt(render, player.position, { x: box.w / 2, y: box.h / 2 });
  };

  Events.on(engine, 'beforeUpdate', handleControl);

  return {
    running,
    player
  }
}