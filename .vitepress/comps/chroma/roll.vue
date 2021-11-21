<template lang="pug">
.flex.flex-col.items-center.w-full

  .flex.flex-col.justify-center.items-center.relative(ref="screen" class="bg-light-600 dark:bg-dark-700")
    control-start.absolute(v-if="!roll.initiated" @click="initiate()") Start
    full-screen.absolute.bottom-6.right-6.z-30(:el="screen")
    .absolute.top-6.left-4.text-2xl x{{ roll.speed }}
    canvas#spectrogram.m-4.w-full.rounded-4xl.cursor-pointer(
      v-drag="dragScreen"
      :width="roll.width"
      :height="roll.height"  
    )
  .flex.justify-center
    control-choose(v-model="roll.direction" :variants="{ 1: 'Vertical', 0: 'Horizontal' }")
</template>

<script setup>
import { useRafFn } from '@vueuse/core'
import { rotateArray } from 'chromatone-theory'
import { useTuner } from '@use/tuner.js'
import { clampNum } from 'chromatone-theory'
const { init, tuner, chain } = useTuner();

const screen = ref()

let canvas, ctx, tempCanvas, tempCtx
const roll = reactive({
  initiated: false,
  width: 1920,
  height: 1080,
  speed: computed(() => Math.floor(roll.speedCount / 100)),
  direction: useStorage('chroma-roll-direction', 0),
  notes: computed(() => rotateArray(tuner.chroma, -3)),
  speedCount: useStorage('chroma-roll-speed', 100),
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

function dragScreen(drag) {
  roll.speedCount = clampNum(roll.speedCount, -drag.delta[0] + drag.delta[1], 100, 1200)
}

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
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawHorizontal() {
  tempCtx.drawImage(canvas, 0, 0, roll.width, roll.height)
  ctx.fillStyle = '#33333399'
  ctx.fillRect(roll.width - roll.speed, 0, roll.speed, roll.height)
  roll.notes.forEach((note, n) => {
    let y = (n + 1) * roll.height / 12
    ctx.fillStyle = colorIt(n, note, 0.5)
    ctx.fillRect(roll.width - roll.speed, roll.height - y, roll.width, roll.height / 12)
  })
  ctx.translate(-roll.speed, 0)
  ctx.drawImage(tempCanvas, 0, 0, roll.width, roll.height)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function colorIt(pitch = 0, value = 1, opacity = 1) {
  return `hsla(${pitch * 30}, ${value * 100}%, ${value * 60}%, ${opacity})`
}
</script>

<style scoped>
</style>

