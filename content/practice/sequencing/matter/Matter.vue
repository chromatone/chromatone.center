<script setup>
import { useMatter } from './useMatter.js';

const { canvas, running } = useMatter();
</script>

<template lang='pug'>
.flex.flex-col.gap-2.absolute.top-0.bottom-0.right-0.left-0.flex.items-center.justify-center.pointer-events-none(v-if="!running")  
  .text-2xl CLICK ANYWHERE
  .text-lg Use arrow keys to control the triangle
section.w-full.h-100svh(ref="canvas")
</template>
