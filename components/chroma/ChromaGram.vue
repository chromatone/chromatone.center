<script setup>
import { useRafFn, useStorage } from '@vueuse/core'
import { rotateArray } from '#/use/calculations'
import { useTuner } from '#/use/tuner'
import { computed, onMounted, reactive, ref } from 'vue';
import { useClamp } from '@vueuse/math';
const { init, tuner } = useTuner();

let canvas, ctx, tempCanvas, tempCtx
const roll = reactive({
  initiated: false,
  width: 1920,
  height: 1080,
  speed: computed(() => Math.floor(roll.speedCount / 100)),
  direction: useStorage('chroma-roll-direction', 0),
  notes: computed(() => rotateArray(tuner.chroma, -3)),
  speedCount: useClamp(useStorage('chroma-roll-speed', 100), 100, 1200),
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
  roll.speedCount += drag.delta[0] - drag.delta[1]
}

function initiate() {
  if (roll.initiated) return
  roll.initiated = true
  init()
  useRafFn(onCanvasDraw)
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
  ctx.translate(0, -roll.speed)
  ctx.drawImage(tempCanvas, 0, 0, roll.width, roll.height)
  roll.notes.forEach((note, n) => {
    let x = (n) * roll.width / 12
    ctx.fillStyle = colorIt(n, note, 0.5)
    ctx.fillRect(x, roll.height - roll.speed, roll.width / 12, roll.speed)
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

function clear() {
  ctx.fillStyle = '#333'
  ctx.fillRect(0, 0, roll.width, roll.height)
}
</script>

<template lang="pug">
.flex.flex-col.items-center.w-full

  #screen.flex.flex-col.justify-center.items-center.relative.bg-light-600.dark-bg-dark-700
    control-start.absolute(
      v-if="!roll.initiated" 
    @click="initiate()") Start
    button.absolute.bottom-4.left-4.text-xl.text-white(@click="roll.direction ? roll.direction = 0 : roll.direction = 1")
      .i-la-arrow-up(v-if="roll.direction == 1")
      .i-la-arrow-left(v-if="roll.direction == 0")
    button.absolute.top-4.right-4.text-xl.select-none.cursor-pointer(@mousedown="clear()")
      .i-la-trash-alt
    .absolute.top-4.left-4.text-xl.text-white x{{ roll.speed }}
    canvas#spectrogram.w-full.rounded-2xl.cursor-pointer(
      v-drag="dragScreen"
      :width="roll.width"
      :height="roll.height"  
      )
</template>

<style lang="postcss" scoped>

</style>

