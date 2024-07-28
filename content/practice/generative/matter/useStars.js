
import { Body, Bodies, Composite, Events, Query, MouseConstraint, Composites, Common, Collision, World, Sleeping } from 'matter-js';
import { engine, canvas, box, running, mouse, score } from './useMatter';


export function useStars() {

  for (let i = 0; i < 2e3; i++) {
    const star = Bodies.circle((2 - 4 * Math.random()) * box.w, (2 - 4 * Math.random()) * box.h, 1, {
      isStatic: true,
      isSensor: true,
      label: 'star',
      collisionFilter: {
        category: 0x0001,
        mask: 0x0001
      },
      render: {
        lineWidth: 0,
        fillStyle: 'currentColor'
      },
    })
    Sleeping.set(star, true);
    Composite.add(engine.world, star);
  }
}

