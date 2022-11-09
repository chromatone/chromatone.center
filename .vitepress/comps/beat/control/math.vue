<script setup>
import { tempo } from '#/use/tempo.js'

function drag(event) {
  tempo.bpm += (event.delta[0] - event.delta[1]) / 16
}


</script>

<template lang="pug">
g.math.cursor-pointer(
  font-size="36"
  :drag-options="{ filterTaps: true }"
  v-drag="drag"
  @dblclick="tempo.bpm = 120"
)
  rect(
    y="-50"
    rx="20"
    width="200"
    height="150"
    fill="transparent"
  )
  line.transition-all.duration-100.ease-out(
    x1="-10"
    x2="-10"
    y1="-20"
    y2="80"
    stroke-width="8"
    stroke-linecap="round"
    :stroke="tempo.blink ? tempo.color : 'transparent'"
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

<style lang="postcss" scoped>

</style>