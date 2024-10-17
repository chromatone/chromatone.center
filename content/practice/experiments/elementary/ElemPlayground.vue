<script setup>
import { ref } from 'vue'
import WebRenderer from '@elemaudio/web-renderer'
import { el, } from '@elemaudio/core'

const initiated = ref(false)
const started = ref(false)

let ctx, core

async function initAudio() {
  if (initiated.value) return
  ctx = new (window.AudioContext || window.webkitAudioContext)()
  core = new WebRenderer()
  const node = await core.initialize(ctx, {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  })
  node.connect(ctx.destination)
  initiated.value = true
}

let setTrig

async function render() {
  if (!initiated.value) await initAudio()
  if (ctx.state === 'suspended') await ctx.resume()
  const [trigger, setTrigger] = core.createRef('const', { value: 0 }, [])
  setTrig = setTrigger
  const signal = el.mul(el.smooth(el.tau2pole(0.01), trigger), el.cycle(220))
  core.render(signal, signal)
  started.value = true
}

function play() {
  if (!started.value) { render() }
  setTrig?.({ value: .2 })
}

function stop() { setTrig?.({ value: 0 }) }

</script>

<template lang="pug">
.flex.items-center.justify-center.h-screen
  button.text-2xl.p-4.cursor-pointer( 
    @pointerdown="play()" 
    @pointerup="stop()" 
    @pointerleave="stop()") {{ started ? 'Press to play sound' : 'Start' }}
</template>
