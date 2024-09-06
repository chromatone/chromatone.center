<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { setTimeout } from 'worker-timers';

import { globalScale, playNoteOnce, } from '#/use/chroma.js';
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

const mutes = reactive([])

const active = reactive({})

// Reuse this object to avoid creating new objects in the loop
const nodeObject = {
  x: 0,
  y: 0,
  note: '',
  midi: 0,
}

const computedNodes = computed(() => {
  const result = []
  for (let node = 0; node < notes.value.length; node++) {
    nodeObject.x = (node + 1) / (notes.value.length + 2)
    nodeObject.y = Math.abs(Math.sin(Math.PI / 2 + Math.PI * tempo.ticks / (192 * 4 + shift.value * node * 8)))
    nodeObject.note = notes.value[node]
    nodeObject.midi = Note.midi(notes.value[node])

    if (nodeObject.y < 0.02 && !mutes[node]) {
      playActiveNote(nodeObject.note)
    }

    result.push({ ...nodeObject })
  }
  return result
})

// Update nodes reactively based on computedNodes
watch(computedNodes, (newNodes) => {
  nodes.splice(0, nodes.length, ...newNodes)
})

function playActiveNote(note) {
  active[note] = true
  playNoteOnce(note)
  setTimeout(() => {
    active[note] = false

  }, 120);

}

function toggleMute(index) {
  mutes[index] = !mutes[index]
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
  .px-4.text-sm.font-mono.border-1.border-dark-100.dark-border-light-300.flex.items-center {{ tempo.ticks }}
svg#bounce.select-none.min-h-100svh.min-w-full(
  ref="svg"
  version="1.1",
  baseProfile="full",
  xmlns="http://www.w3.org/2000/svg",
  style="user-select:none;touch-action:none"
  )

  rect(:width="box.w" :height="box.h" stroke="white" fill="#2222")

  g(v-for="(node, b) in nodes" :key="b")
    rect.op-80.transition-fill.duration-200(
      stroke-width="0"
      :x="node.x * box.w" 
      :y="100"
      :width="box.w / (notes.length + 2) - 10"
      :height="box.h - 200"
      :rx="box.w / (notes.length * 8)"
      :fill="pitchColor(node.midi + 3, 4, undefined, active[node.note] ? 0.9 : mutes[b] ? 0 : 0.2)"
      )
    rect.op-80.transition.cursor-pointer(
      stroke-width="1"
      @click="toggleMute(b)"
      :stroke="pitchColor(noteNames[globalScale.pcs[b % globalScale.pcs.length]], 5, 1, 0.5)"
      :x="node.x * box.w" 
      :y="box.h - 100" :y2="box.h - 100"
      :width="box.w / (notes.length + 2) - 10"
      :height="40"
      :rx="box.w / (notes.length * 8)"
      :fill="active[node.note] ? pitchColor(node.midi + 3, 4) : mutes[b] ? pitchColor(node.midi + 3, 3, 0, 0.2) : 'transparent'"
      )
  g(
    v-for="(node, b) in nodes" :key="b"
    :transform="`translate(${box.w / (notes.length + 4) / 2} 0)`"
    )    
    line.op-20(
      :transform="`translate(${node.x * box.w} 0)`"
      :y1="100"
      :y2="box.h - 100"
      stroke="currentColor"
      )
    line(
      stroke-width="1"
      :stroke="pitchColor(noteNames[globalScale.pcs[b % globalScale.pcs.length]], 5)"
      v-if="b > 0"
      :x1="nodes[b - 1].x * box.w"
      :y1="box.h - 100 - nodes[b - 1].y * (box.h - 200)"
      :x2="node.x * box.w"
      :y2="box.h - 100 - node.y * (box.h - 200)"
      )
  g(
    v-for="(node, b) in nodes" :key="b"
    :transform="`translate(${box.w / (notes.length + 4) / 2} 0)`"
    )
    circle(
      :cx="node.x * box.w" 
      :cy="box.h - 100 - node.y * (box.h - 200)" 
      :r="8" 
      :fill="pitchColor(noteNames[globalScale.pcs[b % globalScale.pcs.length]], 5, mutes[b] ? 0 : 1)")

</template>