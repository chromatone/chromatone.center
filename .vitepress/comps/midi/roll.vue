<template lang="pug">
.flex.flex-col.items-center.w-full
  midi-panel

  .fullscreen-container(ref="screen")
    start-button.absolute( @click="initiate()", v-if="!state.initiated") Start
    full-screen.absolute.bottom-6.right-2(:el="screen")
    canvas#spectrogram.m-4.max-h-80vh.w-full.rounded-md(
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

const screen = ref()

const score = reactive({
  notes: computed(() => {
    let activeNotes = []
    for (let ch in midi.channels) {
      for (let n in midi.channels[ch].notes) {
        let note = midi.channels[ch].notes[n]
        if (note.velocity > 0) {
          activeNotes.push(note)
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
  width: 1200,
  height: 800,
  speed: useStorage('midi-roll-speed', 1),
  direction: useStorage('midi-roll-direction', 1),
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
  if (state.direction == 1) {
    drawVertical()
  } else {
    drawHorizontal()
  }
}

function drawVertical() {
  tempCtx.drawImage(canvas, 0, 0, state.width, state.height)
  ctx.fillStyle = '#333333'
  ctx.fillRect(0, 0, state.width, state.speed)
  for (let i = 0; i < 127; i++) {
    let num = i * state.width / 127
    ctx.fillStyle = colorIt((i + 3) % 12, 1, 0.1)
    ctx.fillRect(num, 0, 1, state.speed)
  }
  ctx.translate(0, state.speed)
  ctx.drawImage(tempCanvas, 0, 0, state.width, state.height)
  score.notes.forEach(note => {
    const size = 16 - note.channel
    ctx.fillStyle = colorIt((note.number + 3) % 12, 1)
    ctx.fillRect(note.number * state.width / 127 - size / 2, 0, size, state.speed * 2)
  })
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawHorizontal() {
  tempCtx.drawImage(canvas, 0, 0, state.width, state.height)
  ctx.fillStyle = '#333333'
  ctx.fillRect(state.width - state.speed, 0, state.speed, state.height)
  // for (let i = 0; i < 127; i++) {
  //   let num = (127 - i) * (state.height / 127)
  //   ctx.fillStyle = colorIt((i + 3) % 12, 0.5, 0.1)
  //   ctx.fillRect(0, state.height - num, state.width, 1)
  // }
  score.notes.forEach(note => {
    ctx.fillStyle = colorIt((note.number + 3) % 12, 1)
    ctx.fillRect(state.width - state.speed, state.height - note.number * state.height / 127, state.speed, 12 - note.channel / 2)
  })
  ctx.translate(-state.speed, 0)
  ctx.drawImage(tempCanvas, 0, 0, state.width, state.height)
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // score.notes.forEach(note => {
  //   ctx.fillStyle = colorIt((note + 3) % 12, 1)
  //   ctx.beginPath();
  //   ctx.arc(state.width - 4, state.height - note * 2, 1, 0, 2 * Math.PI, false);
  //   ctx.fill();
  // })
}

function colorIt(pitch = 0, value = 1, opacity = 1) {
  return `hsla(${pitch * 30}, ${value * 100}%, ${value * 60}%, ${opacity})`
}

</script>

<style scoped>
</style>

