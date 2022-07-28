<script setup>
import { simplex, tracks, zoom } from '../simplex';


import paper from "paper";
import PaperCircle from "./paper-circle.vue";

const canvas = ref()
const size = 512


onMounted(() => {
  // canvas.value.width = canvas.value.height = size
  paper.setup(canvas.value);
  paper.view.draw();
  const raster = new paper.Raster()
  raster.position.x = size / 2
  raster.position.y = size / 2
  raster.width = size
  raster.height = size
  watch(zoom, z => {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        raster.setPixel(x, y, `hsl(0,0%,${(simplex((x - size / 2) / z, (y - size / 2) / z) + 1) * 50}%)`)
      }
    }
  }, { immediate: true })
});

onBeforeUnmount(() => {
  paper.project.clear();
});

function dragZoom(drag) {
  zoom.value -= drag.delta[1] / 10
}

</script>

<template lang='pug'>
.relative.mx-6.flex
  .absolute.px-1.dark_bg-light-100.bg-dark-100.bg-opacity-20.dark_bg-opacity-20.-left-4.bottom-0.rounded-xl(:style="{ height: zoom / 5 + '%' }") 
    .absolute.-left-2.text-xs {{ zoom.toFixed() }}
  canvas.rounded-xl.cursor-pointer.flex-auto.max-w-full(ref="canvas" :width="size" :height="size" v-drag="dragZoom" :drag-options="{ preventWindowScrollY: true }")
    paper-circle(v-for="track in tracks" :key="track" v-bind="track")
</template>