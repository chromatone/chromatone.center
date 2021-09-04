<template lang="pug">
.flex.justify-center(v-if="!state.initiated" )
  start-button(@click="initiate()") Start
.flex.flex-col
  canvas#spectrogram.m-4.rounded-md(
    :width="state.width"
    :height="state.height"
  )
.flex.justify-center
  sqnob(v-model="state.speed" param="speed" :min="1" :max="3" :step="0.5")
</template>
  
<script setup>
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import { freqPitch } from 'chromatone-theory'
import { UserMedia } from 'tone'

const mic = new UserMedia();
let canvas, ctx, tempCanvas, tempCtx
const state = reactive({
  initiated: false,
  width: 400,
  height: 240,
  speed: 1
})

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
    useCanvas: false,
    onCanvasDraw(instance) {
      tempCtx.drawImage(canvas, 0, 0, state.width, state.height)
      let bars = instance.getBars()
      for (let i = 0; i < bars.length; i++) {
        ctx.fillStyle = colorIt((bars[i].freqLo + bars[i].freqHi) / 2, bars[i].value[0])
        ctx.fillRect(state.width - state.speed, state.height - i, state.speed, 1)
      }
      ctx.translate(-state.speed, 0)
      ctx.drawImage(tempCanvas, 0, 0, state.width, state.height)
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  })
}

function colorIt(freq, value) {
  return `hsla(${freqPitch(freq) * 30}, ${value * 100}%, ${value * 80}%, 0.3)`
}

onMounted(() => {
  canvas = document.getElementById('spectrogram')
  ctx = canvas.getContext('2d')
  tempCanvas = document.createElement('canvas')
  tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = state.width
  tempCanvas.height = state.height
  ctx.fillStyle = '#ddd'
  ctx.fillRect(0, 0, state.width, state.height)
});

// freqHi: 21714.84375
// ​​​
// freqLo: 20800.78125
// ​​​
// hold: Array [ 30 ]
// ​​​
// peak: Array [ 0, 0 ]
// ​​​
// posX: 856.8595041322315
// ​​​
// value: Array [ 0 ]

</script>
  
<style scoped>
</style>