<script setup>
import { getCircleCoord } from '#/use/calculations'
import { polarXY, radar } from '../useRadar'
import { useData } from 'vitepress'
const { isDark } = useData()
import paper from 'paper'
import { onBeforeUnmount, reactive, watch } from 'vue';

defineProps({
  zoom: { type: Number, default: 4 }
})


const view = paper.view

const arrow = new paper.Path.Line({
  from: view.center,
  to: [view.center.x, view.bounds.y],
  strokeColor: isDark.value ? '#eee' : '#888',
  strokeCap: 'round',
  strokeWidth: 1,
  pivot: view.center
})

const center = new paper.Shape.Circle({
  center: view.center,
  radius: 4,
  fillColor: isDark.value ? '#eee' : '#888'
})

let octaves = []

for (let o = 1; o < 8; o++) {
  let ring = new paper.Path.Circle(paper.view.center, o / 9 * arrow.length)
  ring.strokeColor = '#f002'
  octaves.push(ring)
}

const bars = reactive([])
const middles = reactive([])

watch(() => radar.zoom, zoom => {
  bars.forEach(bar => bar.remove())
  middles.forEach(bar => bar.remove())
  for (let i = 0; i <= zoom; i++) {
    let coord = getCircleCoord(i, zoom, view.size.width, view.size.width)
    let coordHalf = getCircleCoord(i + 0.5, zoom, view.size.width, view.size.width)
    middles[i] = new paper.Path.Line({
      from: view.center,
      to: [coordHalf.x, coordHalf.y],
      strokeColor: isDark.value ? '#eee1' : '#8881',
      strokeCap: 'round',
      strokeWidth: 1,
      pivot: view.center
    })
    bars[i] = new paper.Path.Line({
      from: view.center,
      to: [coord.x, coord.y],
      strokeColor: isDark.value ? '#eee6' : '#8886',
      strokeCap: 'round',
      strokeWidth: 1,
      pivot: view.center
    })
  }

})

watch(isDark, () => {
  arrow.strokeColor = isDark.value ? '#eee' : '#888'
  center.fillColor = isDark.value ? '#eee' : '#888'
})

paper.view.on('resize', () => {
  arrow.firstSegment.point = paper.view.center
  center.position = paper.view.center
  octaves.forEach(ring => ring.position = view.center)
})

watch(() => radar.angle, angle => {
  let p = polarXY(paper.view.center, 400, angle)
  arrow.lastSegment.point = p
})

onBeforeUnmount(() => {
  arrow.remove();
  center.remove();
  octaves.forEach(ring => ring.remove())
});


</script>

<template lang="pug">
div
</template>

<style lang="postcss" scoped></style>