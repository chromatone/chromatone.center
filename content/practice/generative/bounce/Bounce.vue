<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useResizeObserver, useStorage, useRafFn } from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { Note, Range, Scale } from 'tonal';
import { globalScale, playNoteOnce, noteColor, tempo } from '#/use';
import { noteNames } from '#/use/theory';

const svg = ref();
const box = reactive({ w: 1000, h: 1000 });

useResizeObserver(svg, (entries) => {
  const entry = entries[0];
  box.w = entry.contentRect.width;
  box.h = entry.contentRect.height;
});

const scaleLength = computed(() => globalScale.pcs.length);
const notes = computed(() => Range.numeric([-scaleLength.value, scaleLength.value]).map(Scale.steps(globalScale.full.name)));

const shift = useClamp(useStorage('bounce-shift', 1), 0, 16);
const mutes = ref([]);
const active = ref({});

const nodes = ref([]);

const createNode = (index, totalNotes) => ({
  x: (index + 1) / (totalNotes + 2),
  y: 0,
  note: notes.value[index],
  midi: Note.midi(notes.value[index]),
  fresh: true,
});

const updateNodes = () => {
  const newNodes = notes.value.map((_, index) => createNode(index, notes.value.length));
  nodes.value = newNodes;
};

watch(() => notes.value.length, updateNodes, { immediate: true });

const updateNodePositions = () => {
  nodes.value.forEach((node, index) => {
    let time = tempo.ticks / (192 * 4 + shift.value * index * 8)
    node.y = Math.abs(Math.sin(Math.PI / 2 + Math.PI * time));

    if (node.y < 0.02 && !mutes.value[index]) {
      if (node.fresh) {
        playActiveNote(node.note);
      }
      node.fresh = false;
    } else if (node.y > 0.5) {
      node.fresh = true;
    }
  });
};

useRafFn(updateNodePositions);

const playActiveNote = (note) => {
  active.value[note] = true;
  playNoteOnce(note);
  setTimeout(() => {
    active.value[note] = false;
  }, 120);
};

const toggleMute = (index) => {
  mutes.value[index] = !mutes.value[index];
};

const dragShift = (ev) => {
  shift.value += (ev.delta[0] / 100) - (ev.delta[1] / 100);
};
</script>

<template lang="pug">
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
  version="1.1"
  baseProfile="full"
  xmlns="http://www.w3.org/2000/svg"
  style="user-select:none;touch-action:none"
  dominant-baseline="middle"
  text-anchor="middle"
)
  rect(:width="box.w" :height="box.h" stroke="white" fill="#2222")

  g(v-for="(node, index) in nodes" :key="node.note")
    rect.op-80.transition-fill.duration-200(
      stroke-width="0"
      :x="node.x * box.w" 
      :y="100"
      :width="box.w / (notes.length + 2) - 10"
      :height="box.h - 200"
      :rx="box.w / (notes.length * 8)"
      :fill="noteColor(node.midi + 3, 0, undefined, active[node.note] ? 0.9 : mutes[index] ? 0 : 0.2)"
    )
    rect.op-80.transition.cursor-pointer(
      stroke-width="1"
      @click="toggleMute(index)"
      :stroke="noteColor(noteNames[globalScale.pcs[index % globalScale.pcs.length]], 2, 1, 0.5)"
      :x="node.x * box.w" 
      :y="box.h - 100"
      :width="box.w / (notes.length + 2) - 10"
      :height="40"
      :rx="box.w / (notes.length * 8)"
      :fill="active[node.note] ? noteColor(node.midi + 3, 2) : mutes[index] ? noteColor(node.midi + 3, 1, 0, 0.2) : 'transparent'"
    )
    text(
      :opacity="active[node.note] ? 1 : 0.25"
      :x="node.x * box.w + 25" 
      :y="box.h - 78"
    ) {{ node.note }}

  g(:transform="`translate(${box.w / (notes.length + 4) / 2} 0)`")
    template(v-for="(node, index) in nodes" :key="node.note")
      line.op-20(
        :transform="`translate(${node.x * box.w} 0)`"
        :y1="100"
        :y2="box.h - 100"
        stroke="currentColor"
      )
      line(
        v-if="index > 0"
        stroke-width="1"
        :stroke="noteColor(noteNames[globalScale.pcs[index % globalScale.pcs.length]], 5)"
        :x1="nodes[index - 1].x * box.w"
        :y1="box.h - 100 - nodes[index - 1].y * (box.h - 200)"
        :x2="node.x * box.w"
        :y2="box.h - 100 - node.y * (box.h - 200)"
      )
      circle(
        :cx="node.x * box.w" 
        :cy="box.h - 100 - node.y * (box.h - 200)" 
        :r="8" 
        :fill="noteColor(noteNames[globalScale.pcs[index % globalScale.pcs.length]], 5, mutes[index] ? 0 : 1)"
      )
</template>