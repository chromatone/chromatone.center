<script setup>
import { tempo, tap } from '@use/tempo.js'
</script>

<template lang="pug">
g.tap.cursor-pointer
  g.finger(
    transform="translate(140,0)"
    @mousedown.stop.prevent="tap()"
    @touchstart.stop.prevent="tap()"

  )
    rect(
      width="70"
      height="80"
      rx="10"
      :stroke="tempo.tap.last ? 'currentColor' : '#33333333'"
      fill="transparent"
      stroke-width="4"
      v-tooltip.left="'Tap tempo'"
    )
    fluent-tap-double-20-regular(
      font-size="55"
      transform="translate(2,8)"
      fill="currentColor"
      y="0"
      x="2"
      text-anchor="middle"
    )
  g.bpm.transition-all.duration-200.ease-out(
    @click="tempo.bpm = tempo.tap.bpm"
    v-if="tempo.tap.bpm && tempo.tap.last"
  )
    rect(
      x="0"
      width="120"
      height="80"
      rx="10"
      stroke-width="4"
      fill="transparent"
      :stroke="tempo.tap.last ? 'currentColor' : '#33333333'"
    )
    text(
      fill="currentColor"
      font-size="36"
      y="52"
      x="60"
      text-anchor="middle"
    ) {{ tempo.tap.bpm.toFixed(1) }}
</template>

<style lang="postcss" scoped>
</style>