<script setup>
import { useRafFn, useStorage, useWindowSize } from '@vueuse/core'
import { rotateArray } from '#/use/calculations'
import { useTuner } from '#/use/tuner'
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import { useClamp } from '@vueuse/math';

const { width, height } = useWindowSize()

const { init, tuner } = useTuner();

let canvas, ctx, tempCanvas, tempCtx
const roll = reactive({
  initiated: false,
  width,
  height,
  speed: computed(() => Math.floor(roll.speedCount / 100)),
  direction: useStorage('chromagram-direction', 0),
  notes: computed(() => rotateArray(tuner.chroma, -3)),
  speedCount: useClamp(useStorage('chromagram-speed', 100), 100, 1200),
  pow: useStorage('chromagram-pow', 3),
  offset: useStorage('chromagram-offset', 0),
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

watch([width, height], () => {
  if (!tempCanvas) return
  tempCanvas.width = width.value
  tempCanvas.height = height.value
})

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
  let v = Math.pow(value + roll.offset, roll.pow)
  return `hsla(${pitch * 30}, ${v * 100}%, ${v * 60}%, ${opacity})`
}

function clear() {
  ctx.fillStyle = '#333'
  ctx.fillRect(0, 0, roll.width, roll.height)
}
</script>

<template lang="pug">
.flex.flex-col.items-center.w-full.relative

  #screen.flex.flex-col.justify-center.items-center.relative.bg-light-600.dark-bg-dark-700
    control-start.absolute(
      v-if="!roll.initiated" 
    @click="initiate()") Start
    button.absolute.bottom-4.left-4.text-xl.text-white(@click="roll.direction ? roll.direction = 0 : roll.direction = 1; clear()")
      .i-la-arrow-up(v-if="roll.direction == 1")
      .i-la-arrow-left(v-if="roll.direction == 0")
    button.absolute.top-4.right-4.text-xl.select-none.cursor-pointer(@mousedown="clear()")
      .i-la-trash-alt
    .absolute.top-4.left-4.text-xl.text-white x{{ roll.speed }}
    canvas#spectrogram.w-full.cursor-pointer(
      v-drag="dragScreen"
      :width="width"
      :height="height"  
      )
  .flex.items-center.gap-2.p-2.flex-wrap.absolute.bottom-4.right-4
    .is-group.flex.flex-wrap.gap-2
      ControlRotary(v-model="roll.pow" :min="1" :max="10" :step="1" :fixed="0" param="POW")
      ControlRotary(v-model="roll.offset" :min="-.25" :max=".25" :step=".0001" param="OFFSET" :fixed="2")
</template>

<style lang="postcss" scoped></style>
