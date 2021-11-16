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
import { pitchColor } from 'chromatone-theory'

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
  arrow.position = view.center
  center.position = view.center
  octaves.forEach(ring => ring.position = view.center)
})

const maxPoints = 100
const points = []

watch(() => midi.clock, clock => {
  arrow.rotate(360 / 192)
})

watch(() => midi.note, note => {
  if (note.type == 'noteon' && note.channel == props.channel) {
    let p = arrow.getPointAt(((note.octA + note.pitch / 12) / 9) * arrow.length)
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
  arrow.remove();
  center.remove();
  points.forEach(point => { if (point && point.remove) point.remove() })
  octaves.forEach(ring => ring.remove())
});


</script>

<style scoped>
</style>