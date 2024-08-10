// useNavigator.js
import { ref } from 'vue';
import { Bodies, Composite, Events, Body, Vector } from 'matter-js';
import { engine, render, box } from './useMatter';

export function useNavigator(player, options = {}) {
  const {
    ringRadius = 60,
    pointerRadius = 5,
    opacity = 0.2,
    strokeStyle = 'currentColor',
    pointerStyle = 'currentColor',
  } = options;

  const distance = ref(0);

  const ring = Bodies.circle(player.position.x, player.position.y, ringRadius, {
    label: 'ring',
    isSensor: true,
    isStatic: false,
    collisionFilter: { category: 0x0000, mask: 0x0000 },
    render: {
      opacity,
      lineWidth: 1,
      strokeStyle,
      fillStyle: 'transparent',
      visible: true,
    },
  });

  const pointer = Bodies.circle(player.position.x + ringRadius, player.position.y, pointerRadius, {
    label: 'pointer',
    isSensor: true,
    isStatic: false,
    collisionFilter: { category: 0x0000, mask: 0x0000 },
    render: {
      opacity,
      lineWidth: 1,
      strokeStyle: pointerStyle,
      fillStyle: pointerStyle,
      visible: true,
    },
  });

  const updateNavigator = () => {
    Body.setPosition(ring, player.position);

    const angle = Math.atan2(-player.position.y, -player.position.x);
    Body.setPosition(pointer, {
      x: player.position.x + Math.cos(angle) * ringRadius,
      y: player.position.y + Math.sin(angle) * ringRadius
    });

    distance.value = Math.round(Vector.magnitude(player.position));
  };

  const renderDistance = () => {
    const ctx = render.context;
    ctx.font = '14px Arial';
    ctx.fillStyle = 'currentColor';
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.3

    // Calculate the offset based on the player's position relative to the center
    const offsetX = box.w / 2 - player.position.x;
    const offsetY = box.h / 2 - player.position.y;

    // Apply the offset to the text position
    const textX = pointer.position.x + offsetX;
    const textY = pointer.position.y + offsetY - 15;

    ctx.fillText(distance.value.toString(), textX, textY);
  };

  Composite.add(engine.world, [ring, pointer]);
  Events.on(engine, 'afterUpdate', updateNavigator);
  Events.on(render, 'afterRender', renderDistance);

  const remove = () => {
    Composite.remove(engine.world, [ring, pointer]);
    Events.off(engine, 'afterUpdate', updateNavigator);
    Events.off(render, 'afterRender', renderDistance);
  };

  return {
    distance,
    ring,
    pointer,
    remove,
  };
}