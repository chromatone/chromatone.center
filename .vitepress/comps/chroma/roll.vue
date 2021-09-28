<template lang="pug">
.flex.flex-col.items-center.w-full

  .flex(v-if="!roll.initiated")
    start-button( @click="initiate()") Start
  .flex.flex-col
    canvas#spectrogram.m-4.w-full.rounded-md(
      :width="roll.width"
      :height="roll.height"  
    )
  .flex.justify-center
    sqnob(v-model="roll.speed" param="speed" :min="1" :max="3" :step="0.5")
    choose(v-model="roll.direction" :variants="{ 1: 'Vertical', 0: 'Horizontal' }")
</template>

<script setup>
import { useRafFn } from '@vueuse/core'
import { rotateArray } from 'chromatone-theory'
import { useTuner } from '@use/tuner.js'
const { init, state, chain } = useTuner();

let canvas, ctx, tempCanvas, tempCtx
const roll = reactive({
  initiated: false,
  width: 508,
  height: 508,
  speed: useStorage('chroma-roll-speed', 1),
  direction: useStorage('chroma-roll-direction', 1),
  notes: computed(() => rotateArray(state.chroma, -3))
})

onMounted(() => {
  canvas = document.getElementById('spectrogram')
  ctx = canvas.getContext('2d')
  tempCanvas = document.createElement('canvas')
  tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = roll.width
  tempCanvas.height = roll.height
  ctx.fillStyle = '#333'
  ctx.fillRect(0, 0, roll.width, roll.height)
});

function initiate() {
  if (roll.initiated) return
  roll.initiated = true
  init()
  const { resume, pause } = useRafFn(onCanvasDraw)
}

function onCanvasDraw() {
  if (roll.direction == 1) {
    drawVertical()
  } else {
    drawHorizontal()
  }
}

function drawVertical() {
  tempCtx.drawImage(canvas, 0, 0, roll.width, roll.height)
  ctx.fillStyle = '#33333399'
  ctx.fillRect(0, 0, roll.width, roll.speed)
  ctx.translate(0, roll.speed)
  ctx.drawImage(tempCanvas, 0, 0, roll.width, roll.height)
  roll.notes.forEach((note, n) => {
    let x = (n) * roll.width / 12
    ctx.fillStyle = colorIt(n, note, 0.5)
    ctx.fillRect(x, 0, roll.width / 12, roll.speed)
  })
  // score.notes.forEach(note => {
  //   const size = 16 - note.channel
  //   ctx.fillStyle = colorIt((note.number + 3) % 12, 1)
  //   ctx.fillRect(note.number * 4 - size / 2, 0, size, roll.speed * 2)
  // })
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawHorizontal() {
  tempCtx.drawImage(canvas, 0, 0, roll.width, roll.height)
  ctx.fillStyle = '#33333399'
  ctx.fillRect(roll.width - roll.speed, 0, roll.speed, roll.height)
  roll.notes.forEach((note, n) => {
    let y = (n + 1) * roll.width / 12
    ctx.fillStyle = colorIt(n, note, 0.5)
    ctx.fillRect(roll.width - roll.speed, roll.height - y, roll.width, roll.height / 12)
  })
  // for (let i = 0; i < 127; i++) {
  //   let num = (127 - i) * (roll.height / 127)
  //   ctx.fillStyle = colorIt((num + 3) % 12, 0.5, 0.1)
  //   ctx.fillRect(0, roll.height - num, roll.width, 0.5)
  // }
  // score.notes.forEach(note => {
  //   ctx.fillStyle = colorIt((note.number + 3) % 12, 1)
  //   ctx.fillRect(roll.width - roll.speed, roll.height - note.number * roll.height / 127, roll.speed, 12 - note.channel / 2)
  // })
  ctx.translate(-roll.speed, 0)
  ctx.drawImage(tempCanvas, 0, 0, roll.width, roll.height)
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // score.notes.forEach(note => {
  //   ctx.fillStyle = colorIt((note + 3) % 12, 1)
  //   ctx.beginPath();
  //   ctx.arc(roll.width - 4, roll.height - note * 2, 1, 0, 2 * Math.PI, false);
  //   ctx.fill();
  // })
}

function colorIt(pitch = 0, value = 1, opacity = 1) {
  return `hsla(${pitch * 30}, ${value * 100}%, ${value * 60}%, ${opacity})`
}

                                                                                                                                                                                                                                                                                                                                                                                                                                </script>

<style scoped>
</style>

