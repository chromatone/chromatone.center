<script setup>
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import { initGetUserMedia, master } from '#/use/audio'
import { freqPitch } from '#/use/calculations'
import { useMic } from '#/use/mic'
import { onKeyStroke, useStorage } from '@vueuse/core'
import { ref, computed, reactive, onMounted } from 'vue'
import { useClamp } from '@vueuse/math'

const canvasElement = ref()
const video = ref()

const { mic, input } = useMic()

const paused = ref(false)

onKeyStroke(' ', (e) => {
  paused.value = !paused.value
  e.preventDefault()
})

onKeyStroke('Enter', (e) => {
  clear()
  e.preventDefault()
})

let canvas, ctx, tempCanvas, tempCtx

function clear() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, state.width, state.height)
}

const state = reactive({
  initiated: false,
  width: 800,
  height: 240,
  speed: computed(() => Math.floor(state.speedCount / 100)),
  speedCount: useClamp(100, 100, 300),
  vertical: useStorage('spectrogram-is-vertical', true),
  pow: useStorage('spectrogram-pow', 3),
  offset: useStorage('spectrogram-offset', 0),
})

function dragScreen(drag) {
  if (drag.tap) paused.value = !paused.value
  state.speedCount -= drag.delta[0] / 2
}

onMounted(() => {
  initGetUserMedia()
  canvas = document.getElementById('spectrogram')
  ctx = canvas.getContext('2d')
  tempCanvas = document.createElement('canvas')
  tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = state.width
  tempCanvas.height = state.height
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, state.width, state.height)

  const stream = canvas.captureStream();

  video.value.srcObject = stream;

  video.value.play()
    .then(() => video.value?.requestPictureInPicture?.())
    .catch(error => console.error(error));
});



let audio

function initiate() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(() => {
    state.initiated = true
    audio = new AudioMotionAnalyzer(null, {
      mode: 1,
      connectSpeakers: false,
      volume: 0,
      useCanvas: false,
      source: master.meter,
      onCanvasDraw(instance) {
        if (paused.value) return
        tempCtx.drawImage(canvas, 0, 0, state.width, state.height)
        let bars = instance.getBars()
        for (let i = 0; i < bars.length; i++) {

          ctx.fillStyle = colorIt((bars[i].freqLo + bars[i].freqHi) / 2, bars[i].value[0])

          if (state.vertical) {
            ctx.fillRect(i * (state.width / bars.length), 0, state.width / bars.length, state.speed)
          } else {
            ctx.fillRect(state.width - state.speed, state.height - (i + 1) * (state.height / bars.length), state.speed, state.height / bars.length)
          }
        }
        if (state.vertical) {
          ctx.translate(0, state.speed)
        } else {
          ctx.translate(-state.speed, 0)
        }
        ctx.drawImage(tempCanvas, 0, 0, state.width, state.height)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
    })

    mic.open = true
    audio.connectInput(input)
  }).catch((e) => {
    console.log('mic denied', e)
  })
}


function colorIt(freq, value) {
  let v = Math.pow(value + state.offset, state.pow)
  return `hsl(${freqPitch(freq) * 30}, ${v * 100}%, ${v * 70}%)`
}


</script>
  
<template lang="pug">
.flex.flex-col.justify-center.text-white

  .fullscreen-container.rounded-3xl.overflow-hidden#screen.m-4

    canvas#spectrogram.h-full.min-h-70svh.w-full.rounded-md.cursor-pointer(
      ref="canvasElement"
      v-drag="dragScreen"
      :width="state.width"
      :height="state.height"
    )
    control-start.absolute(
      v-if="!state.initiated" 
      @click="initiate()")
    .absolute.top-4.left-4.text-xl.select-none x{{ state.speed }}
    button.absolute.bottom-4.left-4.text-xl.select-none.cursor-pointer(@mousedown="paused = !paused")
      .i-la-play(v-if="paused")
      .i-la-pause(v-else)
    button.absolute.bottom-4.right-4.text-xl.select-none.cursor-pointer(@mousedown="state.vertical = !state.vertical")
      .i-la-arrow-left(v-if="!state.vertical")
      .i-la-arrow-down(v-else)
    button.absolute.top-4.right-4.text-xl.select-none.cursor-pointer(@mousedown="clear()")
      .i-la-trash-alt
  .flex.items-center.gap-2.px-8.flex-wrap
    .is-group.flex.flex-wrap.gap-2
      ControlRotary(v-model="state.pow" :min="1" :max="10" :step="1" :fixed="0" param="POW")
      ControlRotary(v-model="state.offset" :min="-.25" :max=".25" :step=".0001" param="OFFSET" :fixed="2")

    .max-w-180.mx-auto.relative
      .absolute.p-4.opacity-70 Right click here to open the spectrogram in Picture-In-Picture mode
        .opacity-50 You may need to press play in the floating window to see the spectrogram
      video.max-h-40(ref="video")  
</template>
  
<style lang="postcss" scoped></style>