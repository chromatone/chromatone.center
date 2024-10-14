<script setup>
import { ref, computed, reactive, onMounted, watch, onUnmounted } from 'vue'
import { onKeyStroke, useCycleList, useStorage, useWindowSize } from '@vueuse/core'
import { useClamp } from '@vueuse/math'

import { initGetUserMedia, master } from '#/use/audio'
import { useMicrophone } from '#/use/mic'

let canvas, ctx, tempCanvas, tempCtx, audio

const { mic, input } = useMicrophone()
const { width, height } = useWindowSize()

const canvasElement = ref()
const video = ref()
const paused = ref(false)

const state = reactive({
  initiated: false,
  width,
  height,
  speed: computed(() => Math.floor(state.speedCount / 100)),
  speedCount: useClamp(100, 100, 500),
  vertical: useStorage('spectrogram-vertical', false),
  pow: useStorage('spectrogram-power', 1),
  offset: useStorage('spectrogram-offset', 0),
})

watch([width, height], ([w, h]) => {
  if (!canvas && !tempCanvas) return
  state.width = canvas.width = tempCanvas.width = w
  state.height = canvas.height = tempCanvas.height = h
  clear()
})

onMounted(() => {
  initGetUserMedia()
  canvas = canvasElement.value
  ctx = canvas.getContext('2d')
  tempCanvas = document.createElement('canvas')
  tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = state.width
  tempCanvas.height = state.height
  clear()
  const stream = canvasElement.value.captureStream();
  video.value.srcObject = stream;
  video.value.play()
    .then(() => video.value?.requestPictureInPicture?.())
    .catch(error => console.error(error));
});

const freqPitch = (freq) => 12 * (Math.log(Number(freq) / 440) / Math.log(2))

const colorIt = (freq, value) => `hsl(${freqPitch(freq) * 30}, ${value * 100}%, ${value * 75}%)`

const steepness = useClamp(10, 3, 30)
const midpoint = useClamp(0.5, 0, 1)
const sigmoid = (value) => 1 / (1 + Math.exp(-steepness.value * (value - midpoint.value)))

const onCanvasDraw = (instance) => {
  if (paused.value) return
  tempCtx.drawImage(canvas, 0, 0, state.width, state.height)
  let bars = instance.getBars()
  for (let i = 0; i < bars.length; i++) {
    const centerFreq = (bars[i].freqLo + bars[i].freqHi) / 2
    ctx.fillStyle = colorIt(centerFreq, sigmoid(bars[i].value[0]))

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

const fftSize = useCycleList([4096, 8192, 16384, 32768], { initialValue: 8192 })
watch(fftSize.state, size => audio && (audio.fftSize = size))

const smoothing = useClamp(0.5, 0, 0.9)
watch(smoothing, s => audio && (audio.smoothing = s))

function initiate() {
  navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      autoGainControl: true,
      noiseSuppression: false,
    }, video: false
  }).then(async () => {
    const { AudioMotionAnalyzer } = await import('audiomotion-analyzer')

    audio = new AudioMotionAnalyzer(null, {
      mode: 1,
      connectSpeakers: false,
      volume: 0,
      fftSize: fftSize.state.value,
      smoothing: smoothing.value,
      useCanvas: false,
      onCanvasDraw,
      source: master.meter,
    })
    state.initiated = true
    mic.open = true
    audio.connectInput(input)
  }).catch((e) => {
    console.log('mic denied', e)
  })
}

function clear() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, state.width, state.height)
}

function dragScreen(drag) {
  if (drag.tap) paused.value = !paused.value
  state.speedCount -= drag.delta[0] / 2
}

onKeyStroke(' ', (e) => { paused.value = !paused.value; e.preventDefault() })

onKeyStroke('Enter', (e) => { clear(); e.preventDefault() })

</script>

<template lang="pug">
.flex.flex-col.justify-center
  .fullscreen-container.text-white#screen
    canvas#spectrogram.cursor-pointer.max-w-full(
      ref="canvasElement"
      v-drag="dragScreen"
      :width="state.width"
      :height="state.height"
      )
    control-start.absolute(
      v-if="!state.initiated" 
      @click="initiate()")
    .absolute.top-4.left-4.select-none.cursor-pointer.flex.items-baseline.gap-2(@pointerdown="fftSize.next()") 
      .text-xl x{{ state.speed }} 
      .op-50 {{ fftSize.state }} samples/frame
    button.absolute.bottom-4.left-4.text-xl.select-none.cursor-pointer(@pointerdown="paused = !paused")
      .i-la-play(v-if="paused")
      .i-la-pause(v-else)
    button.absolute.bottom-4.right-4.text-xl.select-none.cursor-pointer(@pointerdown="state.vertical = !state.vertical")
      .i-la-arrow-left(v-if="!state.vertical")
      .i-la-arrow-down(v-else)
    button.absolute.top-4.right-4.text-xl.select-none.cursor-pointer(@pointerdown="clear()")
      .i-la-trash-alt
  .absolute.w-full.bottom-2.flex.items-end.gap-2.px-2.flex-wrap()
    .is-group.flex.flex-wrap.gap-2.flex-0.p-2.op-20.hover-op-80.transition.ml-16(v-if="state.initiated")
      ControlRotary(v-model="steepness" :min="3" :max="30" :step="0.0001" :fixed="2" param="CONTRAST")
      ControlRotary(v-model="midpoint" :min="0" :max="1" :step=".0001" param="MIDPOINT" :fixed="2")
      ControlRotary(v-model="smoothing" :min="0" :max="1" :step=".0001" param="SMOOTH" :fixed="2")
    .flex-1
    .scale-75.max-h-60.overflow-clip.relative.text-white.op-20.hover-op-80.transition 
      .absolute.p-2.opacity-70.touch-none.select-none.text-md Right click here to enter Picture-In-Picture mode
      video.max-h-50(ref="video")  
</template>

<style lang="postcss" scoped></style>