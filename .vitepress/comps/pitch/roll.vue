<template lang="pug">
.flex.flex-col.-my-8
  .flex.p-8.items-center(v-if="tuner.note")
    .flex-1.text-center.font-bold.text-4xl.transition-all.duration-200.flex.items-center(:style="{ color: tuner.note.color }") 
      .p-1.w-2em {{ tuner.note?.name }}
      .p-1.w-1em {{ tuner.note?.octave }} 
      .p-1.mt-2.w-6em.text-sm {{ tuner.note.cents > 0 ? '+' : '' }}{{ tuner.note.cents }} cents
    .btn(@click="draw.running = !draw.running")
      la-play(v-if="!draw.running")
      la-pause(v-else)
    .btn(@click="clear()")
      la-times
    .flex-1.text-center.font-bold  {{ tuner.bpm.toFixed(1) }} BPM

  .fullscreen-container.rounded-xl.cursor-pointer#screen(
    v-drag="dragSpeed"
  )
    control-start.absolute(@click="start()", v-if="!tuner.running") Start rolling 
    .p-1.absolute.top-1.left-1.flex.items-center
      la-angle-double-right
      span {{ draw.speed.toFixed(1) }}
    full-screen.absolute.bottom-1.right-1.z-30
    canvas.w-full.h-full.rounded-xl(    
      :width="1920"
      :height="1080"
      ref="roll" )
</template>

<script setup>
import { pitchColor, rotateArray } from 'chromatone-theory'
import { clampNum } from '@use/theory'
import { useTuner } from '@use/tuner.js'
import { onKeyStroke } from '@vueuse/core'

onKeyStroke(' ', () => {
  draw.running = !draw.running
})

onKeyStroke('Enter', () => {
  clear()
})

function dragSpeed(drag) {
  draw.speed = clampNum(draw.speed, drag.delta[0] / 5, 4, 20)
}

const octaves = [0, 1, 2, 3, 4, 5, 6, 7, 8]

const roller = ref(null)

const { init, tuner, chain } = useTuner();

const draw = reactive({
  running: true,
  speed: useStorage('pitch-roll-speed', 4),
  runnerWidth: 2,
  runnerAhead: 4,
  maxPlotFrequency: 880,
  maxPlotNote: 97,
  minPlotNote: 24,
  prevBeat: 0,
  step: 0,
})

const roll = ref()
let ctx

onMounted(() => {
  ctx = roll.value.getContext('2d')
  // roll.value.width = window.innerWidth
  // roll.value.height = window.innerHeight
})

watch(() => tuner?.frame, frame => {
  if (!draw.running) return
  let x = (frame * draw.speed) % roll.value.width

  // let imageData = ctx.getImageData(0, 0, roll.value.width, roll.value.height);
  // ctx.clearRect(0, 0, roll.value.width, roll.value.height)
  // ctx.globalAlpha = 0.7
  // ctx.putImageData(imageData, 0, 0);

  ctx.globalAlpha = 1
  //runner

  ctx.clearRect(x, 0, draw.speed, roll.value.height)

  ctx.beginPath()
  ctx.fillStyle = tuner.note.color
  ctx.fillRect(x + draw.speed, 0, draw.runnerWidth, roll.value.height)

  //notes
  if (!tuner.note.silent) {
    const y = roll.value.height - (tuner.note.value - draw.minPlotNote) / (draw.maxPlotNote - draw.minPlotNote) * roll.value.height
    ctx.arc(x - 8, y, 8, 0, 4 * Math.PI)
    ctx.fillStyle = tuner.note.color
    ctx.fill()
  }

  if (frame % 50 == 0) {
    // green octave lines
    ctx.beginPath()
    ctx.strokeStyle = "hsla(90,50%,50%,0.1)"
    ctx.lineWidth = "1";
    for (let oct of octaves) {
      let y = roll.value.height - (oct * 12 - draw.minPlotNote) / (draw.maxPlotNote - draw.minPlotNote) * roll.value.height
      ctx.moveTo(0, y)
      ctx.lineTo(roll.value.width, y)
    }
    ctx.stroke()
  }

  ctx.globalAlpha = 0.25
  //beat
  if (tuner.beat > draw.prevBeat) {
    draw.prevBeat = tuner.beat
    ctx.fillStyle = tuner.note.color
    ctx.fillRect(x - 5, 0, 1, roll.value.height)
  }
  // if (frame % 5) {
  //   ctx.globalAlpha = 0.01
  //   ctx.fillStyle = "hsl(0,0%,100%)"
  //   ctx.fillRect(0, 0, roll.value.width, roll.value.height)
  // }

})

function start() {
  init();
};

function clear() {
  ctx.clearRect(0, 0, roll.value.width, roll.value.height)
}



</script>

<style  scoped>
.button {
  @apply p-4 m-8 shadow-lg cursor-pointer transition-all duration-300 rounded-4xl text-4xl bg-light-700 text-center font-bold dark:(bg-dark-400);
}

.btn {
  @apply p-2 cursor-pointer border-1 rounded;
}
</style>