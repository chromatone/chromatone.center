<script setup>
import { ref, reactive, onMounted, watch, computed, watchEffect } from 'vue';
import { useRafFn, useResizeObserver, useTimestamp } from '@vueuse/core';

import { globalScale, } from '#/use/chroma.js';
import { midi, midiPlay, midiStop, playKey } from '#/use/midi.js';
import { Note } from 'tonal';
import { noteNames } from '#/use/theory.js';
import { pitchColor } from '#/use/calculations.js';

import { Range, Scale } from "tonal";
import { tempo } from '#/use';
import { useClamp } from '@vueuse/math';

const svg = ref()
const box = reactive({ w: 1000, h: 1000 })

useResizeObserver(svg, s => {
  box.w = s[0].contentRect.width
  box.h = s[0].contentRect.height
})

const scaleLength = computed(() => globalScale.pcs.length)

const notes = computed(() => Range.numeric([-scaleLength.value, scaleLength.value]).map(Scale.steps(globalScale.full.name)))

const nodes = reactive([])

const shift = useClamp(1, 0, 16)

function dragShift(ev) {
  shift.value += (ev.delta[0] / 100) - (ev.delta[1] / 100)
}

watchEffect(() => {
  nodes.length = 0
  for (let node = 0; node < notes.value.length; node++) {
    const nod = {
      x: (node + 1) / (notes.value.length + 2),
      y: Math.abs(Math.sin(Math.PI / 2 + Math.PI * tempo.ticks / (192 * 4 + shift.value * node * 8))),
      note: notes.value[node],
      midi: Note.midi(notes.value[node])
    }

    if (nod.y < 0.05) {
      playNote(nod.note)
    }

    nodes.push(nod)
  }

})

const active = reactive({})

function playNote(note) {
  setTimeout(() => {
    const midiNote = Note.midi(note)
    if (active[note]) return
    active[note] = true
    playKey(note.slice(0, -1), parseInt(note.slice(-1)) - 4, false, 0.5, 0.5)
    midiPlay(midiNote, {
      attack: 1
    })
    setTimeout(() => {
      active[note] = false
      playKey(note.slice(0, -1), parseInt(note.slice(-1)) - 4, true)
      midiStop(midiNote)
    }, 120);
  }, 2)
}

</script>

<template lang='pug'>
.absolute.flex.flex-wrap.gap-1.w-full.p-1.select-none
  button.p-2.border-1.border-dark-100.dark-border-light-300(@click="tempo.stopped = true")
    .i-la-stop
  button.p-2.border-1.border-dark-100.dark-border-light-300(@click="tempo.playing = !tempo.playing")
    .i-la-play(v-if="!tempo.playing")
    .i-la-pause(v-else)
  .cursor-pointer.p-2.border-1.border-dark-100.dark-border-light-300(v-drag="dragShift") {{ shift.toFixed(2) }}
  .flex-1
  .p-2.text-xs.font-mono.border-1.border-dark-100.dark-border-light-300 {{ tempo.ticks }}
svg#bounce.select-none.min-h-100svh.min-w-full(
  ref="svg"
  version="1.1",
  baseProfile="full",
  xmlns="http://www.w3.org/2000/svg",
  style="user-select:none;touch-action:none"
  )

  rect(:width="box.w" :height="box.h" stroke="white" fill="#2222")

  g(v-for="(node, b) in nodes" :key="node")
    rect.op-80.transition(
      stroke-width="1"
      :stroke="pitchColor(noteNames[globalScale.pcs[b % globalScale.pcs.length]], 5, 1, 0.5)"
      :x="node.x * box.w" 
      :y="box.h - 100" :y2="box.h - 100"
      :width="box.w / (notes.length + 2) - 10"
      :height="40"
      rx="2"
      :fill="active[node.note] ? pitchColor(node.midi + 3, 4) : 'transparent'"
      )
  g(
    v-for="(node, b) in nodes" :key="node"
    :transform="`translate(${box.w / (notes.length + 4) / 2} 0)`"
    )    
    line.op-20(
      :transform="`translate(${node.x * box.w} 0)`"
      :y1="box.h / 3 - 100"
      :y2="box.h - 100"
      stroke="currentColor"
      )
    line(
      stroke-width="1"
      :stroke="pitchColor(noteNames[globalScale.pcs[b % globalScale.pcs.length]], 5)"
      v-if="b > 0"
      :x1="nodes[b - 1].x * box.w"
      :y1="-nodes[b - 1].y * box.h / 1.5 + box.h - 100"
      :x2="node.x * box.w"
      :y2="-node.y * box.h / 1.5 + box.h - 100"
      )
  g(
    v-for="(node, b) in nodes" :key="node"
    :transform="`translate(${box.w / (notes.length + 4) / 2} 0)`"
    )
    circle(
      :cx="node.x * box.w" 
      :cy="-node.y * box.h / 1.5 + box.h - 100" 
      :r="8" 
      :fill="pitchColor(noteNames[globalScale.pcs[b % globalScale.pcs.length]], 5)")

</template>