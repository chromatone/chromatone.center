<script setup>
import { ref, onMounted, watch } from 'vue'
import { onKeyStroke, useFullscreen, useStorage, useWindowSize } from '@vueuse/core'
import { useClamp } from '@vueuse/math';
import { AudioMotionAnalyzer } from 'audiomotion-analyzer'
import { initGetUserMedia } from '#/use';

let ctx, tempCanvas, tempCtx, audio

const screen = ref()
const canvasElement = ref()
const video = ref()

const { width, height } = useWindowSize()
const { toggle } = useFullscreen(screen)

const paused = ref(false)
const showVideo = ref(false)
const initiated = ref(false)
const vertical = useStorage('vertical', false)

watch([width, height], ([w, h]) => {
  if (!canvasElement.value && !tempCanvas) return
  canvasElement.value.width = tempCanvas.width = w
  canvasElement.value.height = tempCanvas.height = h
  clear()
})

onMounted(() => {
  initGetUserMedia()
  ctx = canvasElement.value.getContext('2d')
  tempCanvas = document.createElement('canvas')
  tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = width.value
  tempCanvas.height = height.value
  clear()
  const videostream = canvasElement.value.captureStream();
  video.value.srcObject = videostream;
  video.value.play()
    .then(() => video.value?.requestPictureInPicture?.())
    .catch(error => console.error(error));
});

const smoothing = useClamp(useStorage('smoothing', 0.5), 0, 0.9)
const frame = useClamp(useStorage('frame', 2), 1, 4)
const speed = useClamp(useStorage('speed', 1), 1, 4)
const steepness = useClamp(useStorage('steepness', 10), 3, 30)
const midpoint = useClamp(useStorage('midpoint', 0.5), 0, 1)


watch(frame, f => audio && (audio.fftSize = Math.pow(2, 11 + f)))
watch(smoothing, s => audio && (audio.smoothing = s))

function initiate() {
  navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      autoGainControl: true,
      noiseSuppression: false,
    }, video: false
  }).then(async stream => {

    audio = new AudioMotionAnalyzer(null, {
      mode: 1,
      connectSpeakers: false,
      volume: 0,
      fftSize: 8192,
      smoothing: smoothing.value,
      useCanvas: false,
      onCanvasDraw,
    })

    const micStream = audio.audioCtx.createMediaStreamSource(stream)
    audio.connectInput(micStream)
    initiated.value = true
  }).catch((e) => {
    console.log('mic denied', e)
  })
}

const freqPitch = (freq) => 12 * (Math.log(Number(freq) / 440) / Math.log(2))
const colorIt = (freq, value) => `hsl(${freqPitch(freq) * 30}, ${value * 100}%, ${value * 75}%)`
const sigmoid = (value) => 1 / (1 + Math.exp(-steepness.value * (value - midpoint.value)))

let bars

const onCanvasDraw = (instance) => {
  if (paused.value) return
  bars = instance.getBars()

  tempCtx.drawImage(canvasElement.value, 0, 0, width.value, height.value)
  for (let i = 0; i < bars.length; i++) {
    ctx.fillStyle = colorIt((bars[i].freqLo + bars[i].freqHi) / 2, sigmoid(bars[i].value[0]))

    if (vertical.value) {
      ctx.fillRect(i * (width.value / bars.length), 0, width.value / bars.length, speed.value)
    } else {
      ctx.fillRect(width.value - speed.value, height.value - (i + 1) * (height.value / bars.length), speed.value, height.value / bars.length)
    }
  }
  if (vertical.value) {
    ctx.translate(0, speed.value)
  } else {
    ctx.translate(-speed.value, 0)
  }
  ctx.drawImage(tempCanvas, 0, 0, width.value, height.value)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function clear() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width.value, height.value)
}

onKeyStroke(' ', (e) => { e.preventDefault(); paused.value = !paused.value })

onKeyStroke('Enter', (e) => { e.preventDefault(); clear(); })

</script>

<template lang="pug">
.flex.flex-col.justify-center.bg-black.relative
  .fullscreen-container.text-white#screen(ref="screen")
    canvas#spectrogram.max-w-full(
      @pointerdown="paused = !paused"
      ref="canvasElement"
      :width="width"
      :height="height"
      )
    button.absolute.m-auto.top-0.w-full.h-full(
      v-if="!initiated" 
      @click="initiate()") START

  .flex.absolute.top-2.left-20
    button.text-xl.select-none.cursor-pointer(@pointerdown="paused = !paused")
      .i-la-play(v-if="paused")
      .i-la-pause(v-else)
    button.text-xl.select-none.cursor-pointer(@pointerdown="vertical = !vertical")
      .i-la-arrow-left(v-if="!vertical")
      .i-la-arrow-down(v-else)
    button.text-xl.select-none.cursor-pointer(@pointerdown="clear()")
      .i-la-trash-alt

  .absolute.top-14.left-2.flex.flex-col.text-white.items-center.overscroll-none.overflow-x-hidden.overflow-y-scroll.bg-dark-900.bg-op-20.backdrop-blur.op-40.hover-op-100.transition(v-show="initiated") 
    .is-group.flex.flex-col.gap-2
      ControlRotary(v-model="speed" :min="1" :max="5" :step="1" :fixed="0" param="SPEED")
      ControlRotary(v-model="frame" :min="1" :max="4" :step="1" :fixed="0" param="FRAME")
      ControlRotary(v-model="steepness" :min="3" :max="30" :step="0.0001" :fixed="2" param="CONTRAST")
      ControlRotary(v-model="midpoint" :min="0" :max="1" :step=".0001" param="MIDPOINT" :fixed="2")
      ControlRotary(v-model="smoothing" :min="0" :max="1" :step=".0001" param="SMOOTH" :fixed="2")

  button.absolute.bottom-4.left-4.text-xl.select-none.cursor-pointer.transition(
  :style="{ opacity: showVideo ? 1 : 0.5 }"
    @pointerdown="showVideo = !showVideo")
    .i-la-external-link-square-alt

  .fixed.overflow-clip.text-white.transition.bottom-2.left-30.rounded-xl.overflow-hidden(v-show="showVideo")
    .relative
      .absolute.p-2.opacity-70.touch-none.select-none.text-md Right click here to enter Picture-In-Picture mode
      video.max-h-50.max-w-full(ref="video")
    
</template>

<style lang="postcss" scoped>
button {
  @apply p-4;
}

#screen {
  @apply bg-black;
  width: 100%;
  min-width: 320px;
  min-height: 100vh;
  line-height: 1.3;
  font-family: "Commissioner", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  font-size: 1em;
  font-weight: 400;
  color: var(--c-text);
  direction: ltr;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: all 600ms ease;
  overscroll-behavior-y: none;
}
</style>