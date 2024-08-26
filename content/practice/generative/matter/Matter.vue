<script setup>
import { useMatter } from './useMatter.js';
import Joystick from 'vue-joystick-component'
import { joystick } from './useControls.js';
import { useTerrain } from './useTerrain';

const { canvas, running, score, position } = useMatter();

function stop(ev) {
  Object.assign(joystick, { x: 0, y: 0 })

}

function move(ev) {
  Object.assign(joystick, ev)
}

const { terrainCanvasRef } = useTerrain();

</script>

<template lang='pug'>
.p-0.flex.flex-col.w-full.items-center
  canvas.absolute.top-0.left-0.w-full.h-full(ref="terrainCanvasRef")
  .flex.flex-col.gap-2.absolute.top-0.bottom-0.right-0.left-0.flex.items-center.justify-center.pointer-events-none(v-if="!running")  
    .text-2xl CLICK ANYWHERE
    .text-lg Use arrow keys to control the ship

  .flex.gap-2.absolute.top-0.right-0.left-0.flex.items-center.justify-center.pointer-events-none.p-2

    .flex-1
    .text-sm {{ score }}
    .flex-1 


  Joystick.op-50.fixed.bottom-8.mx-auto.z-20(
    :size="80"
    base-color="#333e"
    stick-color="#eeee"
    :throttle="100"
    @move="move"
    @stop="stop"
    )
  section.w-full.h-100svh.z-10(ref="canvas")
</template>
