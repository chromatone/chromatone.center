<template lang="pug">
.flex.flex-col.justify-center.text-white
  .fullscreen-container.rounded-4xl.overflow-hidden#screen.m-4
    canvas#spectrogram.h-full.min-h-30em.w-full.rounded-md.cursor-pointer(
      :width="state.width"
      :height="state.height"
      v-drag="dragScreen"
    )
    control-start.absolute(v-if="!state.initiated" @click="initiate()")
    full-screen.absolute.bottom-2.right-2
    .absolute.top-4.left-4.text-xl.select-none x{{ state.speed }}
    .absolute.bottom-4.left-4.text-xl.select-none.cursor-pointer(@mousedown="paused = !paused")
      la-play(v-if="paused")
      la-pause(v-else)
    button.absolute.top-4.right-4.text-xl.select-none.cursor-pointer(@mousedown="clear()")
      la-trash-alt

</template>
  
<script setup>
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import { initGetUserMedia, freqPitch } from '@theory'
import { UserMedia } from 'tone'
import { clampNum } from '@theory'
import { onKeyStroke } from '@vueuse/core'

const screen = ref(null)

const paused = ref(false)

onKeyStroke(' ', (e) => {
  paused.value = !paused.value
  e.preventDefault()
})

onKeyStroke('Enter', (e) => {
  clear()
  e.preventDefault()
})

let mic, canvas, ctx, tempCanvas, tempCtx

function clear() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, state.width, state.height)
}

const state = reactive({
  initiated: false,
  width: 800,
  height: 240,
  speed: computed(() => Math.floor(state.speedCount / 100)),
  speedCount: 100
})

function dragScreen(drag) {
  if (drag.tap) paused.value = !paused.value
  state.speedCount = clampNum(state.speedCount, -drag.delta[0] / 2, 100, 300)
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
});

function initiate() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
    state.initiated = true
    const audio = new AudioMotionAnalyzer(null, {
      mode: 1,
      connectSpeakers: false,
      volume: 0,
      useCanvas: false,
      onCanvasDraw(instance) {
        if (paused.value) return
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
    const micStream = audio.audioCtx.createMediaStreamSource(stream);
    audio.connectInput(micStream);
  }).catch((e) => {
    console.log('mic denied', e)
  })
}


function colorIt(freq, value) {
  return `hsl(${freqPitch(freq) * 30}, ${value * 100}%, ${value * 80}%)`
}

</script>
  
<style scoped>
</style>