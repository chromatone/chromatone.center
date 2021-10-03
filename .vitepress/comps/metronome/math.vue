<template lang="pug">
g.math(
  font-size="36"
)
  circle.transition-all.duration-100.ease-out(
    cx="-10"
    cy="-10"
    r="4"
    :fill="tempo.blink ? 'currentColor' : 'transparent'"
  )
  text(
    fill="currentColor"
    ) {{ tempo.bpm.toFixed(2) }} BPM
  text(
    fill="currentColor"
    y="40"
    ) {{ tempo.hz }} Hz
  text(
    y="80"
    :fill="tempo.color"
    font-weight="bold"
) {{ tempo.note }}
</template>

<script setup>
import { tempo } from '@use/tempo.js'
</script>

<style scoped>
</style>