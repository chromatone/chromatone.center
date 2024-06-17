import { watch, } from 'vue';
import { Body, Bodies, Composite } from 'matter-js';
import { engine, box, running } from './useMatter';

export function useBoundaries() {

  var walls = 0x0001
  const bThickness = 300
  let ground, ceiling, leftWall, rightWall;

  function generateBoundaries(w, h) {

    const wallOptions = {
      isStatic: true,
      restitution: 1,
      friction: 0,
      frictionStatic: 0,
      render: {
        visible: true
      },
      collisionFilter: {
        category: walls,
      },
    };
    ground = Bodies.rectangle(w / 2, h + bThickness / 2, w + 2 * bThickness, bThickness, wallOptions);
    ceiling = Bodies.rectangle(w / 2, -50, w + 100, 100, wallOptions);
    leftWall = Bodies.rectangle(-50, h / 2, 100, h + 100, wallOptions);
    rightWall = Bodies.rectangle(w + 50, h / 2, 100, h + 100, wallOptions);


    Composite.add(engine.world, [
      ground,
      ceiling,
      leftWall,
      rightWall,
    ]);
  }

  function generateVertices(type, width, height) {
    switch (type) {
      case 'ground':
        return [
          { x: -width / 2, y: height },
          { x: width + width / 2, y: height },
          { x: width + width / 2, y: height + 2 * bThickness },
          { x: -width / 2, y: height + 2 * bThickness }
        ];
      case 'ceiling':
        return [
          { x: -width / 2, y: -bThickness },
          { x: width + width / 2, y: -bThickness },
          { x: width + width / 2, y: bThickness },
          { x: -width / 2, y: bThickness }
        ];
      case 'leftWall':
        return [
          { x: -bThickness, y: -height / 2 },
          { x: bThickness, y: -height / 2 },
          { x: bThickness, y: height + height / 2 },
          { x: -bThickness, y: height + height / 2 }
        ];
      case 'rightWall':
        return [
          { x: width - bThickness, y: -height / 2 },
          { x: width + bThickness, y: -height / 2 },
          { x: width + bThickness, y: height + height / 2 },
          { x: width - bThickness, y: height + height / 2 }
        ];
      default:
        return [];
    }
  }

  function setBoundary(boundary, type, width, height) {
    const position = {
      ground: { x: width / 2, y: height + bThickness },
      ceiling: { x: width / 2, y: -bThickness },
      leftWall: { x: -bThickness, y: height / 2 },
      rightWall: { x: width + bThickness, y: height / 2 }
    }[type];

    const vertices = generateVertices(type, width, height, bThickness);

    Body.setPosition(boundary, position);
    Body.setVertices(boundary, vertices);
  }

  function updateBoundaries(width, height) {
    setBoundary(ground, 'ground', width, height, bThickness);
    setBoundary(ceiling, 'ceiling', width, height, bThickness);
    setBoundary(leftWall, 'leftWall', width, height, bThickness);
    setBoundary(rightWall, 'rightWall', width, height, bThickness);
  }


  generateBoundaries(box.w, box.h)
  watch(box, b => updateBoundaries(b.w, b.h))

  return {
    generateBoundaries,
    updateBoundaries,
    setBoundary,
    generateVertices,
  }
}

