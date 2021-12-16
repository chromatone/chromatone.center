<script setup>
import paper from 'paper'
import { midi } from '@use/midi'
import { pitchColor } from '@theory'
import { polarXY, radar } from '../radar.js'

const props = defineProps({
  channel: { type: Number, default: 7 },
  in: { type: Number, default: 380 },
  out: { type: Number, default: 400 },
  width: { type: Number, default: 2 },
  rounded: { type: Boolean, default: true },
})

const view = paper.view

const maxPoints = 100
const points = []


watch(() => midi.note, note => {
  if (note.type == 'noteon' && note.channel == props.channel) {

    let circ = new paper.Path.Line({
      from: polarXY(paper.view.center, props.in, radar.angle),
      to: polarXY(paper.view.center, props.out, radar.angle),
      opacity: 1,
      strokeColor: pitchColor(note.pitch, 3, 0.2),
      strokeWidth: props.width,
      strokeCap: props.rounded ? 'round' : '',
    })
    circ.tween({
      opacity: 0,
      easing: 'easeInOutCubic',
    }, 8000)
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

<template lang="pug">

</template>

<style scoped>
</style>