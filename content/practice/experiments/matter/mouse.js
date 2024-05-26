import { Engine, Render, Body, Bodies, World, MouseConstraint, Composites, Query, Runner, Events } from 'matter-js'
import { engine } from './engine';
import { reactive, watch } from 'vue';
import { midi } from '#/use/midi'

export const settings = reactive({
  friction: 0.008,
  bounce: 0.98,
})


export function initMouse(canvas) {

  const box = canvas.value.getBoundingClientRect()
  let w = box.width;
  let h = box.height;

  function createShape(x, y, note) {
    return Bodies.circle(x, y, 25, {
      frictionAir: settings.friction * Math.random(),
      restitution: settings.bounce,
      note,
      plugin: {
        wrap: {
          min: {
            x: 0,
            y: 0
          },
          max: {
            x: w,
            y: h
          }
        }
      }
      // collisionFilter: {
      //   category: balls,
      // },
      // collisionFilter: {
      //   mask: [walls]
      // }
    })
  };


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
      shape.scale = 1.1
    });

  })

  Events.on(mouseControl, 'mousedown', ({ mouse }) => {
    const shape = createShape(mouse.position.x, mouse.position.y, 0);
    initialShapes.bodies.push(shape);
    World.add(engine.world, shape);
  })

  watch(() => midi.note, note => {
    if (!note.velocity) return
    const shape = createShape(w * Math.random(), h * Math.random(), note.number);
    initialShapes.bodies.push(shape);
    World.add(engine.world, shape);
  })


}

