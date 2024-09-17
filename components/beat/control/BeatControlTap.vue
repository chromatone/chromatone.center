<script setup>
import { tempo, tapTempo } from '#/use/tempo'
</script>

<template lang="pug">
g.tap.cursor-pointer
  g.finger(
    transform="translate(140,0)"
    @mousedown.stop.prevent="tapTempo.tap()"
    @touchstart.stop.prevent="tapTempo.tap()"

  )
    rect(
      width="70"
      height="80"
      rx="10"
      :stroke="tapTempo.last ? 'currentColor' : '#33333333'"
      fill="transparent"
      stroke-width="4"
      v-tooltip.left="'Tap tempo'"
    )
    i-fluent-tap-double-20-regular(
      font-size="55"
      transform="translate(2,8)"
      fill="currentColor"
      y="0"
      x="2"
      text-anchor="middle"
    )
  g.bpm.transition-all.duration-200.ease-out(
    @click="tempo.bpm = tapTempo.bpm"
    v-if="tapTempo.bpm && tapTempo.last"
  )
    rect(
      x="0"
      width="120"
      height="80"
      rx="10"
      stroke-width="4"
      fill="transparent"
      :stroke="tapTempo.last ? 'currentColor' : '#33333333'"
    )
    text(
      fill="currentColor"
      font-size="36"
      y="52"
      x="60"
      text-anchor="middle"
    ) {{ tapTempo.bpm.toFixed(1) }}
</template>

<style lang="postcss" scoped></style>