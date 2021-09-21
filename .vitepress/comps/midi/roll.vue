<template lang="pug">
.flex.flex-col.items-center
  midi-panel
  .flex(v-if="!state.initiated")
    start-button( @click="initiate()") Start
  .flex.flex-col
    canvas#spectrogram.m-4.h-30em.max-w-full.rounded-md(
      :width="state.width"
      :height="state.height"  
    )
  .flex.justify-center
    sqnob(v-model="state.speed" param="speed" :min="1" :max="3" :step="0.5")
    choose(v-model="state.direction" :variants="{ 1: 'Vertical', 0: 'Horizontal' }")
</template>

<script setup>
import { useRafFn } from '@vueuse/core'
import { midi } from '@use/midi.js'

const score = reactive({
  notes: computed(() => {
    let activeNotes = []
    for (let ch in midi.channels) {
      for (let n in midi.channels[ch].notes) {
        let note = midi.channels[ch].notes[n]
        if (note.velocity > 0) {
          activeNotes.push(note._number)
        }
      }
    }
    return activeNotes
  }),
  startTime: Date.now(),
  endTime: Date.now(),
})

watch(() => midi.playing, playing => {
  if (playing) {
    score.startTime = midi.note?.timestamp || Date.now()
  } else {
    score.endTime = midi.note?.timestamp || Date.now()
  }
});

let canvas, ctx, tempCanvas, tempCtx
const state = reactive({
  initiated: false,
  width: 400,
  height: 256,
  speed: 1,
  direction: 1,
})

onMounted(() => {
  canvas = document.getElementById('spectrogram')
  ctx = canvas.getContext('2d')
  tempCanvas = document.createElement('canvas')
  tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = state.width
  tempCanvas.height = state.height
  ctx.fillStyle = '#333'
  ctx.fillRect(0, 0, state.width, state.height)
});

function initiate() {
  if (state.initiated) return
  state.initiated = true
  const { resume, pause } = useRafFn(onCanvasDraw)
}

function onCanvasDraw() {
  if (state.vertical == 1) {
    drawVertical()
  } else {
    drawHorizontal()
  }
}

function drawVertical() {
  tempCtx.drawImage(canvas, 0, 0, state.width, state.height)
  ctx.fillStyle = '#333'
  ctx.fillRect(state.width - state.speed, 0, state.speed, state.height)
  ctx.fillStyle = '#4009'
  for (let i = 0; i < 10; i++) {
    let num = 234 - i * 24
    ctx.fillRect(state.width - state.speed, state.height - num, state.speed, 0.5)
  }
  score.notes.forEach(note => {
    ctx.fillStyle = colorIt((note + 3) % 12, 1)
    ctx.fillRect(state.width - state.speed, state.height - note * 2, state.speed, 2)
  })
  ctx.translate(-state.speed, 0)
  ctx.drawImage(tempCanvas, 0, 0, state.width, state.height)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawHorizontal() {
  tempCtx.drawImage(canvas, 0, 0, state.width, state.height)
  ctx.fillStyle = '#333'
  ctx.fillRect(state.width - state.speed, 0, state.speed, state.height)
  ctx.fillStyle = '#4009'
  for (let i = 0; i < 10; i++) {
    let num = 234 - i * 24
    ctx.fillRect(state.width - state.speed, state.height - num, state.speed, 0.5)
  }
  score.notes.forEach(note => {
    ctx.fillStyle = colorIt((note + 3) % 12, 1)
    ctx.fillRect(state.width - state.speed, state.height - note * 2, state.speed, 2)
  })
  ctx.translate(-state.speed, 0)
  ctx.drawImage(tempCanvas, 0, 0, state.width, state.height)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function colorIt(pitch, value) {
  return `hsl(${pitch * 30}, ${value * 100}%, ${value * 80}%)`
}

</script>

<style scoped>
</style>

