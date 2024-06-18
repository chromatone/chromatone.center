<script setup>
import { ref, reactive, onMounted, watch, computed, watchEffect } from 'vue';
import { useRafFn, useResizeObserver, useTimestamp } from '@vueuse/core';

import { globalScale, } from '#/use/chroma.js';
import { midi, midiPlay, midiStop, playKey } from '#/use/midi.js';
import { Note } from 'tonal';
import { noteNames } from '#/use/theory.js';
import { pitchColor } from '#/use/calculations.js';

import { Range, Scale } from "tonal";

const svg = ref()
const box = reactive({ w: 1000, h: 1000 })

useResizeObserver(svg, s => {
  box.w = s[0].contentRect.width
  box.h = s[0].contentRect.height
})


const time = useTimestamp({ offset: -Date.now() })

const scaleLength = computed(() => globalScale.pcs.length)

const n = computed(() => scaleLength.value * 2 + 1)

const notes = computed(() => Range.numeric([0, n.value]).map(Scale.steps(globalScale.full.name)))

const nodes = reactive([])

watchEffect(() => {
  nodes.length = 0
  for (let node = 0; node <= n.value; node++) {
    const nod = {
      x: (node + 1) / (n.value + 2),
      y: Math.abs(Math.sin(-10 + time.value / (1000 + node * 10))),
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
p.absolute.text-xs {{ time }}
svg#bounce.select-none.min-h-100svh.min-w-full(
  ref="svg"
  version="1.1",
  baseProfile="full",
  xmlns="http://www.w3.org/2000/svg",
  style="user-select:none;touch-action:none"
  )

  rect(:width="box.w" :height="box.h" stroke="white" fill="#2222")

  g(v-for="(node, b) in nodes" :key="node")
    rect(
      :transform="`translate(${-box.w / n / 2} 0)`"
      stroke-width="2"
      stroke="currentColor"
      :x="node.x * box.w + 5" 
      :y="box.h - 100" :y2="box.h - 100"
      :width="box.w / (n + 2) - 10"
      :height="40"
      rx="2"
      :fill="active[node.note] ? pitchColor(node.midi + 3, 4) : 'transparent'"
      )
    line(
      stroke-width="1"
      stroke="currentColor" 
      v-if="b > 0"
      :x1="nodes[b - 1].x * box.w"
      :y1="-nodes[b - 1].y * box.h / 1.5 + box.h - 100"
      :x2="node.x * box.w"
      :y2="-node.y * box.h / 1.5 + box.h - 100"
      )
    circle(
      :cx="node.x * box.w" 
      :cy="-node.y * box.h / 1.5 + box.h - 100" 
      :r="8" 
      :fill="pitchColor(noteNames[globalScale.pcs[b % globalScale.pcs.length]], 5)")



//- line.transition(
//-   :x1="box.w / 2" 
//-   :x2="box.w / 2" 
//-   :y1="0" 
//-   :y2="box.h" 
//-   :stroke="midi.note.velocity > 0 ? pitchColor(midi.note.pitch) : '#999'")


  //- g(v-for="(pen, p) in bouncers" :key="pen")
  //-   g(v-for="(coord, c) in pen.coords" :key="coord")
  //-     line( v-if="c !== 0"
  //-       :x1="box.w / 2 + pen.coords[c - 1].x * box.h / (n + 1)"
  //-       :y1="box.h / 10 - pen.coords[c - 1].y * box.h / (n + 1)"
  //-       :x2="box.w / 2 + coord.x * box.h / (n + 1)"
  //-       :y2="box.h / 10 - coord.y * box.h / (n + 1)"
  //-       :stroke-width="(p * 2 + 1) * 2"
  //-       stroke="currentColor")
  //-   g(v-for="(coord, c) in pen" :key="coord")
  //-     circle(
  //-       style="transform-origin: center; transform-box: fill-box; transition: transform 1s ease-in-out;"
  //-       :style="{ transform: `scale(${pen.active[globalScale.full.notes[c]] ? 2 : 1})` }"
  //-       :fill="pitchColor(noteNames[globalScale.pcs[c]], 4)" 
  //-       :cx="box.w / 2 + coord.x * box.h / (n + 1)" 
  //-       :cy="box.h / 10 - coord.y * box.h / (n + 1)" 
  //-       :r="(p + 1) * 10")
</template>