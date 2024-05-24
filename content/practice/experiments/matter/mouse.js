import { Engine, Render, Body, Bodies, World, MouseConstraint, Composites, Query, Runner, Events } from 'matter-js'
import { engine } from './engine';
import { reactive } from 'vue';


export const settings = reactive({
  friction: 0.001,
  bounce: .7,
})


function createShape(x, y) {
  return Bodies.circle(x, y, 25, {
    frictionAir: settings.friction,
    restitution: settings.bounce + 0.0001,
  })
};

export function initMouse(canvas) {

  const mouseControl = MouseConstraint.create(engine, {
    element: canvas.value,
    constraint: {
      render: {
        visible: false
      }
    }
  });

  const initialShapes = Composites.stack(5, 5, 10, 5, 10, 10, function (x, y) {
    return createShape(x, y)
  });

  World.add(engine.world, [
    mouseControl,
    initialShapes
  ]);

  Events.on(mouseControl, 'mousemove', ({ mouse }) => {
    const hoveredShapes = Query.point(initialShapes.bodies, mouse.position);

    hoveredShapes.forEach(shape => {
      shape.render.fillStyle = "orange"
      shape.render.lineWidth = 0
    });

  })

  Events.on(mouseControl, 'mousedown', ({ mouse }) => {
    const shape = createShape(mouse.position.x, mouse.position.y);
    initialShapes.bodies.push(shape);
    World.add(engine.world, shape);
  })
}

