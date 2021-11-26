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
        midi-radar-layer-pointer
        midi-radar-layer-circles(:channel="5" :grow="300" to-center)
        midi-radar-layer-circles(:channel="8" :grow="1" )
        midi-radar-layer-ticks(:channel="3")
        midi-radar-layer-clock()
</template>

<script setup>
import { useRadar } from './radar.js'
const { screen, radar } = useRadar()

</script>
