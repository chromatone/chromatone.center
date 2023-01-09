<script setup>
import { useRadar } from './radar.js'
import Circles from './layers/circles.vue'
import Clock from './layers/clock.vue'
import Pointer from './layers/pointer.vue'
import Ticks from './layers/ticks.vue'
import { useClamp } from '@vueuse/math'

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
      .i-la-times 
      .p-0 {{ radar.zoom }}
    canvas.max-w-full.max-h-full.h-full.w-full.min-h-600px(
      ref="screen"
      style="cursor:none"
      resize="true"
      width="1000"
      height="1000"
      )
      div(v-if="radar.loaded")
        Clock(:zoom="radar.zoom")
        Pointer
        Circles.lead(
          :channel="0" 
          :size="8" 
          :line-width="20" 
          :grow="20")
        Circles.bass(
          :channel="5"  
          :size="10" 
          :line-width="10" 
          :grow="60")
        Circles.lead(
          :channel="6" 
          :size="12" 
          :line-width="20")
        Circles.arp(
          :channel="7" 
          :grow="12" 
          :size="6" 
          :line-width="0.5")
        Circles.chords(
          :channel="8" 
          :grow="80" 
          :size="36" 
          :line-width="0.1" 
          blend-mode="overlay" 
          :opacity="0.6")
        Ticks.kick(
          :channel="1" 
          :in="30" 
          :out="80" 
          :width="18" 
          :rounded="true")
        Ticks.snare(
          :channel="2" 
          :in="30" 
          :out="420" 
          :width="2")
        Ticks.hihat(
          :channel="3"  
          :width="8")
        Ticks.fx(
          :channel="4" 
          :in="320" 
          :out="360" 
          :width="12" 
          :rounded="false")
</template>
