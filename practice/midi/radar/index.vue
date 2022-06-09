<script setup>
import { useRadar } from './radar.js'
import { default as circles } from './layer/circles.vue'
import { default as clock } from './layer/clock.vue'
import { default as pointer } from './layer/pointer.vue'
import { default as ticks } from './layer/ticks.vue'
const { screen, radar } = useRadar()

</script>

<template lang="pug">
.flex.flex-col
  #screen.flex.flex-col.w-full.items-stretch.relative.fullscreen-container.rounded-3xl.shadow-xl
    full-screen.absolute.top-2.right-2
    canvas.max-w-full.max-h-full.h-full.w-full.min-h-600px(
      style="cursor:none"
      resize="true"
      ref="screen"
      width="1000"
      height="1000"
    )
      div(v-if="radar.loaded")
        clock
        pointer
        circles.bass(:channel="5"  :size="10" :line-width="10")
        circles.lead(:channel="6" :size="8" :line-width="4")
        circles.arp(:channel="7" :grow="12" :size="6" :line-width="0.5")
        circles.chords(:channel="8" :grow="80" :size="36" :line-width="0.1" blend-mode="overlay" :opacity="0.6")
        ticks.kick(:channel="1" :in="30" :out="100" :width="15" :rounded="false")
        ticks.snare(:channel="2" :in="30" :out="420" :width="2")
        ticks.hihat(:channel="3"  :width="8")
        ticks.fx(:channel="4" :in="350" :out="360" :width="10" :rounded="false")
</template>
