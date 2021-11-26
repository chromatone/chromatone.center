<template lang="pug">

</template>

<script setup>
import { getCircleCoord } from 'chromatone-theory'
import { polarXY, radar } from '../radar.js'

import paper from 'paper'

const view = paper.view

const arrow = new paper.Path.Line({
  from: view.center,
  to: [view.center.x, view.bounds.y],
  strokeColor: 'black',
  strokeCap: 'round',
  strokeWidth: 1,
  pivot: view.center
})

const center = new paper.Shape.Circle({
  center: view.center,
  radius: 6,
  fillColor: '#888'
})

let octaves = []

for (let o = 1; o < 8; o++) {
  let ring = new paper.Path.Circle(paper.view.center, o / 9 * arrow.length)
  ring.strokeColor = '#f002'
  octaves.push(ring)
}

paper.view.on('resize', ev => {
  arrow.firstSegment.point = paper.view.center
  center.position = paper.view.center
  octaves.forEach(ring => ring.position = view.center)
})

const maxPoints = 100
const points = []

watch(() => radar.angle, angle => {
  let p = polarXY(paper.view.center, 500, angle)
  arrow.lastSegment.point = p
})

onBeforeUnmount(() => {
  arrow.remove();
  center.remove();
  octaves.forEach(ring => ring.remove())
});


</script>

<style scoped>
</style>