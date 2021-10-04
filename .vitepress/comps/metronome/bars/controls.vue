<template lang="pug">
g.controls(
  font-size="30"
  stroke-width="2"
  fill="transparent"
)
  g.control(
    @click="setTempo(1)"
    transform="translate(55)"
  )
    circle(
      cx="18"
      cy="18"
      r="20"
      stroke="currentColor"
    )
    la-plus
  g.control(
    @click="setTempo(-1)"
  )
    circle(
      cx="18"
      cy="18"
      r="20"
      stroke="currentColor"
    )
    la-minus
  g.control(
    @click="setTempo(-tempo.bpm / 2)"
    transform="translate(0,55)"
  )
    circle(
      cx="18"
      cy="18"
      r="20"
      stroke="currentColor"
    )
    la-slash
  g.control(
    @click="setTempo(tempo.bpm)"
    transform="translate(55,55)"
  )
    circle(
      cx="18"
      cy="18"
      r="20"
      stroke="currentColor"
    )
    la-times
  
</template>

<script setup>
import { tempo } from '@use/tempo.js'
import { clampNum } from '@use/theory'

function setTempo(diff) {
  tempo.bpm = Math.round(clampNum(tempo.bpm, diff, 10, 500))
}
</script>

<style scoped>
.controls {
  @apply cursor-pointer;
}

.control circle {
  transition: all 200ms ease-out;
}

.control:hover circle {
  stroke-width: 4;
}
</style>