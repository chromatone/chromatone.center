import { ref, onMounted, watch } from 'vue';
import { createNoise2D } from 'simplex-noise';
import { engine, box, position } from './useMatter';

const GRID_CELL_SIZE = 30;
const CONTOUR_LEVELS = 12;
const NOISE_SCALE = 0.0004;

const noise2D = createNoise2D();
let ctx;
let terrainCanvas;

const colorPalette = ref(generateColorPalette());

function generateColorPalette() {
  return Array.from({ length: CONTOUR_LEVELS }, (_, i) => {
    const hue = (i * 30) % 360;
    return `hsla(${hue}, 70%, 50%,30%)`;
  });
}

export function useTerrain() {
  const terrainCanvasRef = ref(null);

  onMounted(() => {
    terrainCanvas = terrainCanvasRef.value;
    ctx = terrainCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  });

  watch(() => [position.value.x, position.value.y], drawTerrain, { immediate: true });

  return {
    terrainCanvasRef
  };
}

function resizeCanvas() {
  if (!terrainCanvas) return;
  terrainCanvas.width = window.innerWidth;
  terrainCanvas.height = window.innerHeight;
  drawTerrain();
}

function drawTerrain() {
  if (!ctx) return;

  const { x: playerX, y: playerY } = position.value;

  const startX = Math.floor((playerX - box.w / 2) / GRID_CELL_SIZE) * GRID_CELL_SIZE;
  const startY = Math.floor((playerY - box.h / 2) / GRID_CELL_SIZE) * GRID_CELL_SIZE;
  const endX = Math.ceil((playerX + box.w / 2) / GRID_CELL_SIZE) * GRID_CELL_SIZE;
  const endY = Math.ceil((playerY + box.h / 2) / GRID_CELL_SIZE) * GRID_CELL_SIZE;

  ctx.clearRect(0, 0, terrainCanvas.width, terrainCanvas.height);

  for (let level = 0; level < CONTOUR_LEVELS; level++) {
    ctx.beginPath();
    ctx.strokeStyle = colorPalette.value[level];
    ctx.lineWidth = 2;

    for (let x = startX; x < endX; x += GRID_CELL_SIZE) {
      for (let y = startY; y < endY; y += GRID_CELL_SIZE) {
        marchingSquares(x, y, level / CONTOUR_LEVELS);
      }
    }

    ctx.stroke();
  }
}

function marchingSquares(x, y, threshold) {
  const screenX = x - position.value.x + box.w / 2;
  const screenY = y - position.value.y + box.h / 2;

  const values = [
    generateElevation(x, y),
    generateElevation(x + GRID_CELL_SIZE, y),
    generateElevation(x + GRID_CELL_SIZE, y + GRID_CELL_SIZE),
    generateElevation(x, y + GRID_CELL_SIZE)
  ];

  const points = values.map(v => v > threshold ? 1 : 0);
  const index = points[0] * 8 + points[1] * 4 + points[2] * 2 + points[3];

  switch (index) {
    case 1: drawLine(screenX, screenY + GRID_CELL_SIZE / 2, screenX + GRID_CELL_SIZE / 2, screenY + GRID_CELL_SIZE); break;
    case 2: drawLine(screenX + GRID_CELL_SIZE / 2, screenY + GRID_CELL_SIZE, screenX + GRID_CELL_SIZE, screenY + GRID_CELL_SIZE / 2); break;
    case 3: drawLine(screenX, screenY + GRID_CELL_SIZE / 2, screenX + GRID_CELL_SIZE, screenY + GRID_CELL_SIZE / 2); break;
    case 4: drawLine(screenX + GRID_CELL_SIZE / 2, screenY, screenX + GRID_CELL_SIZE, screenY + GRID_CELL_SIZE / 2); break;
    case 5: drawLine(screenX, screenY + GRID_CELL_SIZE / 2, screenX + GRID_CELL_SIZE / 2, screenY);
      drawLine(screenX + GRID_CELL_SIZE / 2, screenY + GRID_CELL_SIZE, screenX + GRID_CELL_SIZE, screenY + GRID_CELL_SIZE / 2); break;
    case 6: drawLine(screenX + GRID_CELL_SIZE / 2, screenY, screenX + GRID_CELL_SIZE / 2, screenY + GRID_CELL_SIZE); break;
    case 7: drawLine(screenX, screenY + GRID_CELL_SIZE / 2, screenX + GRID_CELL_SIZE / 2, screenY); break;
    case 8: drawLine(screenX, screenY + GRID_CELL_SIZE / 2, screenX + GRID_CELL_SIZE / 2, screenY); break;
    case 9: drawLine(screenX + GRID_CELL_SIZE / 2, screenY, screenX + GRID_CELL_SIZE / 2, screenY + GRID_CELL_SIZE); break;
    case 10: drawLine(screenX, screenY + GRID_CELL_SIZE / 2, screenX + GRID_CELL_SIZE / 2, screenY + GRID_CELL_SIZE);
      drawLine(screenX + GRID_CELL_SIZE / 2, screenY, screenX + GRID_CELL_SIZE, screenY + GRID_CELL_SIZE / 2); break;
    case 11: drawLine(screenX + GRID_CELL_SIZE / 2, screenY, screenX + GRID_CELL_SIZE, screenY + GRID_CELL_SIZE / 2); break;
    case 12: drawLine(screenX, screenY + GRID_CELL_SIZE / 2, screenX + GRID_CELL_SIZE, screenY + GRID_CELL_SIZE / 2); break;
    case 13: drawLine(screenX + GRID_CELL_SIZE / 2, screenY + GRID_CELL_SIZE, screenX + GRID_CELL_SIZE, screenY + GRID_CELL_SIZE / 2); break;
    case 14: drawLine(screenX, screenY + GRID_CELL_SIZE / 2, screenX + GRID_CELL_SIZE / 2, screenY + GRID_CELL_SIZE); break;
  }
}

function drawLine(x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

function generateElevation(x, y) {
  return (noise2D(x * NOISE_SCALE, y * NOISE_SCALE) + 1) / 2;
}

export function setTerrainColorPalette(newPalette) {
  if (Array.isArray(newPalette) && newPalette.length === CONTOUR_LEVELS) {
    colorPalette.value = newPalette;
    drawTerrain();
  } else {
    console.error('Invalid color palette. Must be an array of 12 colors.');
  }
}