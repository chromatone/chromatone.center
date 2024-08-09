import { Body, Bodies, Composite, Events } from 'matter-js';
import { engine, box } from './useMatter';

const GRID_DIVISIONS = 12;

const objectPool = {
  gridLines: []
};
let gridLines = [];
let cellSize;

export function useGrid() {
  calculateCellSize();
  createGridLines();
  Events.on(engine, 'afterUpdate', updateGridPosition);
}

function calculateCellSize() {
  // Use the larger dimension to calculate the cell size
  cellSize = Math.max(box.w, box.h) / GRID_DIVISIONS;
}

function createGridLines() {
  const gridSize = cellSize * GRID_DIVISIONS;

  // Create vertical lines
  for (let i = 0; i <= GRID_DIVISIONS; i++) {
    gridLines.push(getLineFromPool(i * cellSize, 0, i * cellSize, gridSize));
  }

  // Create horizontal lines
  for (let i = 0; i <= GRID_DIVISIONS; i++) {
    gridLines.push(getLineFromPool(0, i * cellSize, gridSize, i * cellSize));
  }

  Composite.add(engine.world, gridLines);
}

function getLineFromPool(x1, y1, x2, y2) {
  let line;
  if (objectPool.gridLines.length > 0) {
    line = objectPool.gridLines.pop();
    Body.setVertices(line, [{ x: x1, y: y1 }, { x: x2, y: y2 }]);
  } else {
    line = Bodies.rectangle((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1) || 1, Math.abs(y2 - y1) || 1, {
      isStatic: true,
      isSensor: true,
      render: { opacity: 0.05, fillStyle: 'currentColor', lineWidth: 1, }
    });
  }
  return line;
}

function updateGridPosition() {
  const player = engine.world.bodies.find(body => body.label === 'player');
  if (!player) return;

  const playerPosition = player.position;
  const offsetX = playerPosition.x % cellSize;
  const offsetY = playerPosition.y % cellSize;
  const startX = playerPosition.x - (box.w / 2) + 100;
  const startY = playerPosition.y - (box.h / 2) + 100;

  gridLines.forEach((line, index) => {
    if (index <= GRID_DIVISIONS) {
      // Vertical lines
      const x = startX + (index * cellSize) - offsetX;
      Body.setPosition(line, { x, y: playerPosition.y });
    } else {
      // Horizontal lines
      const y = startY + ((index - (GRID_DIVISIONS + 1)) * cellSize) - offsetY;
      Body.setPosition(line, { x: playerPosition.x, y });
    }
  });
}