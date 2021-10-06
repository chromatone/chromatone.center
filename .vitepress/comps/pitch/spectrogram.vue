<template lang="pug">
.flex.flex-col.justify-center
  .fullscreen-container(ref="screen")
    canvas#spectrogram.m-4.h-full.min-h-30em.w-full.rounded-md.cursor-pointer(
      :width="state.width"
      :height="state.height"
      v-drag="dragScreen"
    )
    start-button.absolute(v-if="!state.initiated" @click="initiate()") Start
    full-screen.absolute.bottom-6.right-4(:el="screen")
    .absolute.top-6.left-4.text-2xl x{{ state.speed }}

</template>
  
<script setup>
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import { freqPitch } from 'chromatone-theory'
import { UserMedia } from 'tone'
import { clampNum } from '@use/theory'

const screen = ref(null)

let mic, canvas, ctx, tempCanvas, tempCtx
const state = reactive({
  initiated: false,
  width: 800,
  height: 240,
  speed: computed(() => Math.floor(state.speedCount / 100)),
  speedCount: 100
})

function dragScreen(drag) {
  state.speedCount = clampNum(state.speedCount, -drag.delta[0] / 2, 100, 300)
}

onMounted(() => {
  mic = new UserMedia();
  canvas = document.getElementById('spectrogram')
  ctx = canvas.getContext('2d')
  tempCanvas = document.createElement('canvas')
  tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = state.width
  tempCanvas.height = state.height
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, state.width, state.height)
});

function initiate() {
  mic.open().then(() => {
    state.initiated = true
    analyze()

  }).catch(() => {
    console.log('mic denied')
  })
}

function analyze() {
  const audio = new AudioMotionAnalyzer(null, {
    source: mic,
    mode: 1,
    connectSpeakers: false,
    volume: 0,
    useCanvas: false,
    onCanvasDraw(instance) {
      tempCtx.drawImage(canvas, 0, 0, state.width, state.height)
      let bars = instance.getBars()
      for (let i = 0; i < bars.length; i++) {
        ctx.fillStyle = colorIt((bars[i].freqLo + bars[i].freqHi) / 2, bars[i].value[0])
        ctx.fillRect(state.width - state.speed, state.height - i * (state.height / bars.length), state.speed, 1)
      }
      ctx.translate(-state.speed, 0)
      ctx.drawImage(tempCanvas, 0, 0, state.width, state.height)
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  })
}

function colorIt(freq, value) {
  return `hsl(${freqPitch(freq) * 30}, ${value * 100}%, ${value * 80}%)`
}

</script>
  
<style scoped>
</style>