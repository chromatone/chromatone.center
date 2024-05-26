import { Body, Bodies, World } from 'matter-js'
import { engine } from './engine';

var walls = 0x0001

const wallOptions = {
  isStatic: true,
  render: {
    visible: true
  },
  collisionFilter: {
    category: walls,
  },
};

const bThickness = 200

let ground, ceiling, leftWall, rightWall

export function generateBoundaries(w, h) {
  ground = Bodies.rectangle(w / 2, h, w + 100, 100, wallOptions);
  ceiling = Bodies.rectangle(w / 2, -50, w + 100, 100, wallOptions);
  leftWall = Bodies.rectangle(-50, h / 2, 100, h + 100, wallOptions);
  rightWall = Bodies.rectangle(w + 50, h / 2, 100, h + 100, wallOptions);


  World.add(engine.world, [
    ground,
    ceiling,
    leftWall,
    rightWall,
  ]);
}

export function generateVertices(type, width, height) {
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

export function setBoundary(boundary, type, width, height) {
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

export function updateBoundaries(width, height) {
  setBoundary(ground, 'ground', width, height, bThickness);
  setBoundary(ceiling, 'ceiling', width, height, bThickness);
  setBoundary(leftWall, 'leftWall', width, height, bThickness);
  setBoundary(rightWall, 'rightWall', width, height, bThickness);
}