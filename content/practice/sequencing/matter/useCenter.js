import { ref, watch } from 'vue';
import { Body, Bodies, Composite, Events, Vector, Render } from 'matter-js';
import { globalScale } from '#/use';
import { engine, box, running, renderer } from './useMatter';
import { onKeyDown, onKeyUp } from '@vueuse/core';

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

  const pressedKeys = ref({});

  const steer = 0.03
  const thrust = 10;

  const handleControl = () => {

    let acc = pressedKeys.value.ArrowUp ? -thrust : (pressedKeys.value.ArrowDown ? thrust : 0);



    Body.setAngularVelocity(center, pressedKeys.value.ArrowLeft ? -steer : (pressedKeys.value.ArrowRight ? steer : 0))

    const force = Vector.create(Math.cos(center.angle) * acc, Math.sin(center.angle) * acc)

    // Render.lookAt(renderer, center, { x: 200, y: 200 });

    Body.applyForce(center, center.position, force);
  };

  // Create Matter engine, world, circle, and renderer (same as before)

  Events.on(engine, 'beforeUpdate', handleControl);

  const handleKeyPress = (event) => {
    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) event.preventDefault();
    pressedKeys.value[event.key] = event.type === 'keydown';
  };

  onKeyDown(handleKeyPress);
  onKeyUp(handleKeyPress);


  return {
    running,
    center
  }
}