<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useResizeObserver, } from '@vueuse/core';
import { setTimeout } from 'worker-timers';

import { globalScale, playNoteOnce } from '#/use/chroma.js';
import { midi } from '#/use/midi.js';
import { Note } from 'tonal';
import { noteNames } from '#/use/theory.js';
import { pitchColor } from '#/use/calculations.js';
import { tempo } from '#/use/tempo.js';

import { Pendulum } from './pendulum.js'

const svg = ref()
const box = reactive({ w: 1000, h: 1000 })
const n = computed(() => globalScale.pcs.length)

useResizeObserver(svg, s => {
  box.w = s[0].contentRect.width
  box.h = s[0].contentRect.height
})

const pendulums = reactive([])
for (let i = 0; i < 2; i++) {
  pendulums[i] = usePendulum(-i)
}

function usePendulum(octaveOffset = 0) {

  const active = reactive({})

  const pendulum = computed(() => new Pendulum(
    globalScale.pcs.length,
    Array(globalScale.pcs.length).fill(1).map((el, i) => Math.PI + (octaveOffset != 0 ? 1 : -2) * Math.PI * (1 - Math.random() / (i + 1)) / 4),
    Array(globalScale.pcs.length).fill(1).map(() => (octaveOffset != 0 ? -4 : 2) * Math.random() + 0.5)
  ))

  const coords = ref([])

  watch(() => tempo.ticks, (ts, to) => {
    if (ts < to) ts = to + 1
    pendulum.value.tick((ts - to) * 0.0015)
    coords.value = pendulum.value.coordinates
  })

  watch(coords, (newCoord, oldCoord) => {
    newCoord.forEach((coord, c) => {
      if (coord.x * oldCoord?.[c]?.x < 0) {
        const note = globalScale.full.notes[c]
        active[note] = true
        playNoteOnce(note)
      }
    })
  })

  return {
    coords, n, active
  }
}



</script>

<template lang='pug'>
.absolute.flex.flex-wrap.gap-1.w-full.p-1
  button.p-2.border-1.border-dark-100.dark-border-light-300(@click="tempo.stopped = true")
    .i-la-stop
  button.p-2.border-1.border-dark-100.dark-border-light-300(@click="tempo.playing = !tempo.playing")
    .i-la-play(v-if="!tempo.playing")
    .i-la-pause(v-else)
  .flex-1
  .p-2.text-xs.font-mono.border-1.border-dark-100.dark-border-light-300 {{ tempo.ticks }}

.absolute.bottom-0.top-0.left-0.right-0.flex.items-center.justify-center.text-2xl.z-100(@click="tempo.playing = true" v-if="!tempo.started") Press anywhere

svg#metronome.select-none.min-h-100svh.min-w-full(
  ref="svg"
  version="1.1",
  baseProfile="full",
  xmlns="http://www.w3.org/2000/svg",
  style="user-select:none;touch-action:none"
  )

  rect(:width="box.w" :height="box.h" stroke="white" fill="#2222")

  line.transition(
    :x1="box.w / 2" 
    :x2="box.w / 2" 
    :y1="0" 
    :y2="box.h" 
    :stroke="midi.note.velocity > 0 ? pitchColor(midi.note.pitch) : '#999'")

  circle(:cx="box.w / 2" :cy="box.h / 10" :r="8" fill="currentColor")
  g(v-for="(pen, p) in pendulums" :key="pen")
    g(v-for="(coord, c) in pen.coords" :key="coord")
      line(
        :x1="c === 0 ? box.w / 2 : box.w / 2 + pen.coords[c - 1].x * box.h / (n + 1)"
        :y1="c === 0 ? box.h / 10 : box.h / 10 - pen.coords[c - 1].y * box.h / (n + 1)"
        :x2="box.w / 2 + coord.x * box.h / (n + 1)"
        :y2="box.h / 10 - coord.y * box.h / (n + 1)"
        :stroke-width="(p * 2 + 1) * 2"
        stroke="currentColor")
    g(v-for="(coord, c) in pen.coords" :key="coord")
      circle(
        style="transform-origin: center; transform-box: fill-box; transition: transform 1s ease-in-out;"
        :style="{ transform: `scale(${pen.active[globalScale.full.notes[c]] ? 2 : 1})` }"
        :fill="pitchColor(noteNames[globalScale.pcs[c]], 4)" 
        :cx="box.w / 2 + coord.x * box.h / (n + 1)" 
        :cy="box.h / 10 - coord.y * box.h / (n + 1)" 
        :r="(p + 1) * 10")
</template>