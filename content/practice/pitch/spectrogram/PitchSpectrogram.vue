<script setup>
import { initGetUserMedia, master } from '#/use/audio'
import { freqPitch } from '#/use/calculations'
import { useMicrophone } from '#/use/mic'
import { onKeyStroke, useStorage, useWindowSize } from '@vueuse/core'
import { ref, computed, reactive, onMounted, watch, onUnmounted } from 'vue'
import { useClamp } from '@vueuse/math'

const canvasElement = ref()
const video = ref()

const { mic, input } = useMicrophone()

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

const { width, height } = useWindowSize()

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

function dragScreen(drag) {
  if (drag.tap) paused.value = !paused.value
  state.speedCount -= drag.delta[0] / 2
}

watch([width, height], ([newWidth, newHeight]) => {
  if (canvas && tempCanvas) {
    canvas.width = newWidth
    canvas.height = newHeight
    tempCanvas.width = newWidth
    tempCanvas.height = newHeight
  }
})

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

// onUnmounted(() => {
//   audio.stop()
// })

let audio

function initiate() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(async () => {
    const { AudioMotionAnalyzer } = await import('audiomotion-analyzer')

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
    state.initiated = true
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
    .absolute.top-4.left-4.text-xl.select-none x{{ state.speed }}
    button.absolute.bottom-4.left-4.text-xl.select-none.cursor-pointer(@mousedown="paused = !paused")
      .i-la-play(v-if="paused")
      .i-la-pause(v-else)
    button.absolute.bottom-4.right-4.text-xl.select-none.cursor-pointer(@mousedown="state.vertical = !state.vertical")
      .i-la-arrow-left(v-if="!state.vertical")
      .i-la-arrow-down(v-else)
    button.absolute.top-4.right-4.text-xl.select-none.cursor-pointer(@mousedown="clear()")
      .i-la-trash-alt
  .absolute.w-full.bottom-2.flex.items-center.gap-2.px-2.flex-wrap 
    .is-group.flex.flex-wrap.gap-2.flex-0.p-2.op-20.hover-op-80.transition
      ControlRotary(v-model="state.pow" :min="1" :max="10" :step="1" :fixed="0" param="POW")
      ControlRotary(v-model="state.offset" :min="-.5" :max=".5" :step=".0001" param="OFFSET" :fixed="2")
    .flex-1
    .scale-75.max-h-60.overflow-clip.relative.text-white.op-20.hover-op-80.transition 
      .absolute.p-2.opacity-70.touch-none.select-none.text-md Right click here to enter Picture-In-Picture mode
      video.max-h-50(ref="video")  
</template>

<style lang="postcss" scoped></style>