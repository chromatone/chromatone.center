import { ref, watch } from 'vue';
import { Body, Bodies, Composite, Events, Vector, Render, Mouse, Constraint } from 'matter-js';
import { globalScale } from '#/use';
import { engine, box, running, render } from './useMatter';
import { pressedKeys, joystick } from './useControls'
import { useSpring } from 'vue-use-spring'

export const cameraOffsetX = useSpring(0, { stiffness: 0.1, damping: 0.8 });
export const cameraOffsetY = useSpring(0, { stiffness: 0.1, damping: 0.8 });

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
    let accX = pressedKeys.ArrowLeft ? -thrust : (pressedKeys.ArrowRight ? thrust : 0);
    let accY = pressedKeys.ArrowUp ? -thrust : (pressedKeys.ArrowDown ? thrust : 0);

    accX -= joystick.x * thrust;
    accY -= joystick.y * thrust;

    Body.setAngularVelocity(player, pressedKeys.ArrowLeft ? -steer : (pressedKeys.ArrowRight ? steer : 0) + joystick.x * steer);

    const force = Vector.create(Math.cos(player.angle) * accY, Math.sin(player.angle) * accY);
    Body.applyForce(player, player.position, force);

    // Calculate camera offset based on player's velocity
    const maxOffset = 10; // Maximum offset in pixels
    const maxVelocity = 10; // Maximum velocity to consider for full offset

    const velocityMagnitude = Vector.magnitude(player.velocity);
    const normalizedVelocity = Math.min(velocityMagnitude / maxVelocity, 1);

    const velocityAngle = Math.atan2(player.velocity.y, player.velocity.x);

    cameraOffsetX.value = -Math.cos(velocityAngle) * normalizedVelocity * maxOffset;
    cameraOffsetY.value = -Math.sin(velocityAngle) * normalizedVelocity * maxOffset;

    // Calculate camera position with offset
    const cameraX = player.position.x - cameraOffsetX.value;
    const cameraY = player.position.y - cameraOffsetY.value;

    Render.lookAt(render, { x: cameraX, y: cameraY }, { x: box.w / 2, y: box.h / 2 });
  };

  Events.on(engine, 'beforeUpdate', handleControl);

  return {
    running,
    player
  }
}