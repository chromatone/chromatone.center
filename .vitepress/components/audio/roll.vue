<template lang="pug">
.flex.flex-col.-my-8
  .p-4.m-8.shadow-lg.cursor-pointer.transition-all.duration-300.rounded-xl.text-4xl.bg-gray-300.text-center.font-bold(@click="start()", v-if="!state.running") Start roll
  .flex.p-8.items-center(v-if="state.note")
    .flex-1.text-center.font-bold.text-4xl.transition-all.duration-200(:style="{ color: state.note.color }") {{ state.note?.name }}{{ state.note?.octave }} 
    .flex-1.text-center.font-bold  {{ state.bpm.toFixed(1) }} BPM
  canvas(ref="roll")
</template>

<script setup>
import { defineProps, ref, computed, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import { noteColor } from 'chromatone-theory'
import { useTuner } from '../../use/useTuner.js'

const octaves = [22.5, 55, 110, 220, 440, 880]

const { init, state, chain } = useTuner();

const draw = reactive({
  speed: 4,
  runnerWidth: 2,
  runnerAhead: 4,
  maxPlotFrequency: 880,
  prevBeat: 0,
  step: 0,
})

const roll = ref()
let context

onMounted(() => {
  context = roll.value.getContext('2d')
  roll.value.width = window.innerWidth
  roll.value.height = window.innerHeight / 2
})



watch(() => state?.frame, frame => {
  let x = (frame * draw.speed) % roll.value.width

  //runner
  context.beginPath()
  context.clearRect(x, 0, draw.speed, roll.value.height)

  context.fillStyle = state.note.color
  context.fillRect(x + draw.runnerAhead, 0, draw.runnerWidth, roll.value.height)

  //notes
  if (!state.note.silent) {
    const y = roll.value.height - state.note.frequency / draw.maxPlotFrequency * roll.value.height
    context.arc(x - 5, y, 5, 0, 4 * Math.PI)
    context.fillStyle = state.note.color
    context.fill()
  }

  // red lines
  context.beginPath()
  context.strokeStyle = "hsla(0,50%,50%,0.04)"
  context.lineWidth = "0.5";
  for (let oct of octaves) {
    let y = roll.value.height - oct / draw.maxPlotFrequency * roll.value.height
    context.moveTo(0, y)
    context.lineTo(roll.value.width, y)
  }
  context.stroke()

  //beat
  if (state.beat > draw.prevBeat) {
    draw.prevBeat = state.beat
    context.fillStyle = "hsla(0,0%,50%,0.2)"
    context.fillRect(x - 5, 0, 1, roll.value.height)
  }
})

function start() {
  init();
}



</script>

<style scoped>
.meter {
  transition: transform 500ms ease;
}
</style>