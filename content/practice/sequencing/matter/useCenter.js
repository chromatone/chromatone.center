import { ref, watch } from 'vue';
import { Body, Bodies, Composite, Events, Vector, Render } from 'matter-js';
import { globalScale } from '#/use';
import { engine, box, running, renderer } from './useMatter';
import { pressedKeys, joystick } from './useControls'


export function useCenter() {

  const strokeStyle = `hsl(${globalScale.tonic * 30}deg, 50%, 50%)`

  const center = Bodies.polygon(box.w / 2, box.h / 2, 3, Math.min(box.w / 40, box.h / 40), {
    label: 'player',
    restitution: .95,
    friction: 0.4,
    frictionStatic: 0.001,
    density: 80,
    render: {
      lineWidth: 2,
      strokeStyle,
      fillStyle: 'transparent',
      visible: true,
    },
  });

  Composite.add(engine?.world, [center]);

  const steer = 0.07
  const thrust = 10;

  const handleControl = () => {

    let acc = pressedKeys.ArrowUp ? -thrust : (pressedKeys.ArrowDown ? thrust : 0);

    acc -= joystick.y * thrust

    Body.setAngularVelocity(center, pressedKeys.ArrowLeft ? -steer : (pressedKeys.ArrowRight ? steer : 0) + joystick.x * steer)

    const force = Vector.create(Math.cos(center.angle) * acc, Math.sin(center.angle) * acc)

    // Render.lookAt(renderer, center, { x: 200, y: 200 });

    Body.applyForce(center, center.position, force);
  };

  // Create Matter engine, world, circle, and renderer (same as before)

  Events.on(engine, 'beforeUpdate', handleControl);



  return {
    running,
    center
  }
}