<script setup>
import { useMatter } from './useMatter.js';
import Joystick from 'vue-joystick-component'
import { joystick } from './useControls.js';

const { canvas, running, score } = useMatter();

function stop(ev) {
  Object.assign(joystick, { x: 0, y: 0 })

}

function move(ev) {
  Object.assign(joystick, ev)
}
</script>

<template lang='pug'>
.p-0.flex.flex-col.w-full.items-center
  .flex.flex-col.gap-2.absolute.top-0.bottom-0.right-0.left-0.flex.items-center.justify-center.pointer-events-none(v-if="!running")  
    .text-2xl CLICK ANYWHERE
    .text-lg Use arrow keys to control the ship

  .flex.flex-col.gap-2.absolute.top-4.right-0.left-0.flex.items-center.justify-center.pointer-events-none
    .text-sm {{ score }}

  Joystick.op-50.fixed.bottom-8.mx-auto(
    :size="80"
    base-color="#333e"
    stick-color="#eeee"
    :throttle="100"
    @move="move"
    @stop="stop"
    )
  section.w-full.h-100svh(ref="canvas")
</template>
