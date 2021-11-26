<template lang="pug">

</template>

<script setup>
const props = defineProps({
  channel: { type: Number, default: 7 },
  grow: { type: Number, default: 0 },
  toCenter: { type: Boolean, default: false },
})

import paper from 'paper'
import { midi } from '@use/midi'
import { pitchColor, getCircleCoord } from 'chromatone-theory'
import { polarXY, radar } from '../radar.js'

const view = paper.view

const maxPoints = 100
const points = []


watch(() => midi.note, note => {
  if (note.type == 'noteon' && note.channel == props.channel) {

    let coord = getCircleCoord(radar.angle, 360, ((note.octA + note.pitch / 12) / 9) * 500, 750)
    let p = new paper.Point(coord.x, coord.y)
    let circ = new paper.Shape.Circle({
      center: p,
      radius: 10,
      opacity: 0.8,
      fillColor: pitchColor(note.pitch)
    })
    circ.tween({
      opacity: 0,
      easing: 'easeInOutCubic',
    }, 4000)
    if (props.grow > 0) {
      circ.tween({
        radius: props.grow,
        easing: 'easeInOutCubic',
      }, 8000)
    }
    if (props.toCenter) {
      circ.tween({
        position: view.center,
        easing: 'easeInOutCubic',
      }, 4000)
    }
    points.unshift(circ)
  }
  if (points.length > maxPoints) {
    for (let i = maxPoints; i <= points.length; i++) {
      if (!points[i] || !points[i].remove) return
      points[i].remove()
    }
    points.length = maxPoints
  }
})

watch(() => midi.playing, playing => {
  if (!playing) {
    points.forEach(point => { if (point && point.remove) point.remove() })
  }
})

onBeforeUnmount(() => {
  points.forEach(point => { if (point && point.remove) point.remove() })
});


</script>

<style scoped>
</style>