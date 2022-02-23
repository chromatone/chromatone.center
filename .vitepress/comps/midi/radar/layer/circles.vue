<script setup>
const props = defineProps({
  channel: { type: Number, default: 7 },
  grow: { type: Number, default: 0 },
  toCenter: { type: Boolean, default: false },
  size: { type: Number, default: 10 },
  lineWidth: { type: Number, default: 1 },
  opacity: { type: Number, default: 1 },
  blendMode: { type: String, default: 'normal' },
})

import paper from 'paper'
import { midi } from '@use/midi'
import { pitchColor, getCircleCoord } from '@theory'
import { polarXY, radar } from '../radar.js'

const view = paper.view

const maxPoints = 60
const points = []
const lines = []


watch(() => midi.note, note => {
  if (note.type == 'noteon' && note.channel == props.channel) {

    let coord = polarXY(view.center, ((note.octA + note.pitch / 12) / 9) * 500, radar.angle);
    let p = new paper.Point(coord.x, coord.y)
    let circ = new paper.Shape.Circle({
      center: p,
      radius: props.size,
      opacity: 0,
      fillColor: pitchColor(note.pitch),
      blendMode: props.blendMode,
    })

    circ.tween({
      opacity: props.opacity
    }, 200).then(() => {
      circ.tween({
        opacity: 0,
        easing: 'easeInOutCubic',
      }, 8000)
    })

    let line = new paper.Path.Line({
      strokeColor: pitchColor(note.pitch),
      strokeWidth: props.lineWidth,
      from: points[0]?.position || circ.position,
      to: circ.position,
      strokeCap: 'round',
      blendMode: props.blendMode,
    })

    line.tween({
      opacity: props.opacity
    }, 200).then(() => {
      line.tween({
        opacity: 0,
        easing: 'easeInOutCubic',
      }, 8000)
    })




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
    lines.unshift(line)
  }
  if (points.length > maxPoints) {
    for (let i = maxPoints; i <= points.length; i++) {
      if (!points[i] || !points[i].remove) return
      points[i].remove()
    }
    points.length = maxPoints
  }

  if (lines.length > maxPoints) {
    for (let i = maxPoints; i <= lines.length; i++) {
      if (!lines[i] || !lines[i].remove) return
      lines[i].remove()
    }
    lines.length = maxPoints
  }
})

watch(() => midi.playing, playing => {
  if (!playing) {
    points.forEach(point => { if (point && point.remove) point.remove() })
    lines.forEach(point => { if (point && point.remove) point.remove() })
  }
})

onBeforeUnmount(() => {
  points.forEach(point => { if (point && point.remove) point.remove() })
  lines.forEach(point => { if (point && point.remove) point.remove() })
});


</script>

<template lang="pug">

</template>

<style scoped>
</style>