import { onKeyDown, onKeyUp } from '@vueuse/core';
import { reactive } from 'vue';

onKeyDown(handleKeyPress);
onKeyUp(handleKeyPress);

export const pressedKeys = reactive({});
export const joystick = reactive({ x: 0, y: 0 })

function handleKeyPress(event) {
  if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) event.preventDefault();
  pressedKeys[event.key] = event.type === 'keydown';
};

