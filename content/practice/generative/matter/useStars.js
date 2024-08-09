import { Body, Bodies, Composite, Vector, Bounds, Events } from 'matter-js';
import { engine, box } from './useMatter';

const STAR_DENSITY = 0.0001;
const STAR_SIZE = 2;
const GRID_CELL_SIZE = 200;

const starGrid = new Map();
const visibleStars = new Set();
const objectPool = {
  stars: []
};
const visibleArea = { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };

export function useStars() {
  initStarGrid();
  Events.on(engine, 'afterUpdate', updateStarVisibility);
}

function initStarGrid() {
  for (let x = -10; x <= 10; x++) {
    for (let y = -10; y <= 10; y++) {
      createStarsInCell(x, y);
    }
  }
}

function createStarsInCell(cellX, cellY) {
  const cellKey = `${cellX},${cellY}`;
  if (starGrid.has(cellKey)) return;

  const cellStars = [];
  const starsInCell = Math.floor(GRID_CELL_SIZE * GRID_CELL_SIZE * STAR_DENSITY);

  for (let i = 0; i < starsInCell; i++) {
    const star = getStarFromPool();
    positionStarInCell(star, cellX, cellY);
    cellStars.push(star);
  }

  starGrid.set(cellKey, cellStars);
}

function getStarFromPool() {
  if (objectPool.stars.length > 0) {
    return objectPool.stars.pop();
  }
  return createStar();
}

function createStar() {
  return Bodies.circle(0, 0, STAR_SIZE, {
    isStatic: true,
    isSensor: true,
    label: 'star',
    collisionFilter: { category: 0x0001, mask: 0x0001 },
    render: { lineWidth: 0, fillStyle: 'currentColor' },
  });
}

function positionStarInCell(star, cellX, cellY) {
  Body.setPosition(star, {
    x: cellX * GRID_CELL_SIZE + Math.random() * GRID_CELL_SIZE,
    y: cellY * GRID_CELL_SIZE + Math.random() * GRID_CELL_SIZE,
  });
}

function updateStarVisibility() {
  const player = engine.world.bodies.find(body => body.label === 'player');
  if (!player) return;

  const playerPosition = player.position;
  updateVisibleArea(playerPosition);

  const visibleCells = getVisibleCells();
  updateVisibleStars(visibleCells);
}

function updateVisibleArea(playerPosition) {
  visibleArea.min.x = playerPosition.x - box.w / 2;
  visibleArea.min.y = playerPosition.y - box.h / 2;
  visibleArea.max.x = playerPosition.x + box.w / 2;
  visibleArea.max.y = playerPosition.y + box.h / 2;
}

function getVisibleCells() {
  const cells = [];
  const minCellX = Math.floor(visibleArea.min.x / GRID_CELL_SIZE);
  const minCellY = Math.floor(visibleArea.min.y / GRID_CELL_SIZE);
  const maxCellX = Math.ceil(visibleArea.max.x / GRID_CELL_SIZE);
  const maxCellY = Math.ceil(visibleArea.max.y / GRID_CELL_SIZE);

  for (let x = minCellX; x <= maxCellX; x++) {
    for (let y = minCellY; y <= maxCellY; y++) {
      cells.push(`${x},${y}`);
      if (!starGrid.has(`${x},${y}`)) {
        createStarsInCell(x, y);
      }
    }
  }

  return cells;
}

function updateVisibleStars(visibleCells) {
  const newVisibleStars = new Set();

  for (const cellKey of visibleCells) {
    const cellStars = starGrid.get(cellKey);
    for (const star of cellStars) {
      if (Bounds.contains(visibleArea, star.position)) {
        newVisibleStars.add(star);
        if (!visibleStars.has(star)) {
          Composite.add(engine.world, star);
        }
      }
    }
  }

  for (const star of visibleStars) {
    if (!newVisibleStars.has(star)) {
      Composite.remove(engine.world, star);
      objectPool.stars.push(star);
    }
  }

  visibleStars.clear();
  for (const star of newVisibleStars) {
    visibleStars.add(star);
  }
}