<script setup>
import { useRadar } from './radar.js'
import { default as circles } from './layer/circles.vue'
import { default as clock } from './layer/clock.vue'
import { default as pointer } from './layer/pointer.vue'
import { default as ticks } from './layer/ticks.vue'
const { screen, radar } = useRadar()

const zoomer = useClamp(1, 1, 8)

function dragZoom(ev) {
  zoomer.value += ev.delta[0] / 100 - ev.delta[1] / 100
  radar.zoom = Math.round(zoomer.value)
}

</script>

<template lang="pug">
.flex.flex-col
  #screen.flex.flex-col.w-full.items-stretch.relative.fullscreen-container.rounded-3xl.shadow-xl(v-drag="dragZoom")
    full-screen.absolute.top-2.right-2
    .absolute.top-4.left-4.flex.items-center.select-none
      la-times 
      .p-0 {{ radar.zoom }}
    canvas.max-w-full.max-h-full.h-full.w-full.min-h-600px(
      style="cursor:none"
      resize="true"
      ref="screen"
      width="1000"
      height="1000"
      )
      div(v-if="radar.loaded")
        clock(:zoom="radar.zoom")
        pointer
        circles.bass(:channel="5"  :size="10" :line-width="10" :grow="60")
        circles.lead(:channel="6" :size="8" :line-width="4")
        circles.arp(:channel="7" :grow="12" :size="6" :line-width="0.5")
        circles.chords(:channel="8" :grow="80" :size="36" :line-width="0.1" blend-mode="overlay" :opacity="0.6")
        ticks.kick(:channel="1" :in="30" :out="80" :width="18" :rounded="true")
        ticks.snare(:channel="2" :in="30" :out="420" :width="2")
        ticks.hihat(:channel="3"  :width="8")
        ticks.fx(:channel="4" :in="320" :out="360" :width="12" :rounded="false")
</template>
