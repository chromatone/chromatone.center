<template lang="pug">
.flex.flex-col
  midi-panel.mb-4
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
        midi-radar-layer-clock
        midi-radar-layer-pointer
        midi-radar-layer-circles.bass(:channel="5"  :size="10" :line-width="10")
        midi-radar-layer-circles.lead(:channel="6" :size="8" :line-width="4")
        midi-radar-layer-circles.arp(:channel="7" :grow="12" :size="6" :line-width="0.5")
        midi-radar-layer-circles.chords(:channel="8" :grow="80" :size="36" :line-width="0.1" blend-mode="overlay" :opacity="0.6")
        midi-radar-layer-ticks.kick(:channel="1" :in="30" :out="100" :width="15" :rounded="false")
        midi-radar-layer-ticks.snare(:channel="2" :in="30" :out="420" :width="2")
        midi-radar-layer-ticks.hihat(:channel="3"  :width="8")
        midi-radar-layer-ticks.fx(:channel="4" :in="350" :out="360" :width="10" :rounded="false")
</template>

<script setup>
import { useRadar } from './radar.js'
const { screen, radar } = useRadar()

</script>
