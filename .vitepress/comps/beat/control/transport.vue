<template lang="pug">
g.transport(
  font-size="60"
)
  g.btn.cursor-pointer(
  transform="translate(0,50)"
  @click="tempo.playing = !tempo.playing"
  )
    rect.border(
      fill="transparent"
      stroke-width="4"
      x="0"
      y="0"
      rx="10"
      width="70"
      height="80"
    )
    g(
      transform="translate(-2,4)"
    )
      la-play(
        v-if="!tempo.playing"
      )
      la-pause(
        v-else
      )
  g.btn.cursor-pointer(
    transform="translate(0,150)"
    @click="tempo.stopped = true"
    )
      rect.border(
        fill="transparent"
        stroke-width="4"
        x="0"
        y="0"
        rx="10"
        width="70"
        height="80"
        )
      la-stop(
      y="5"
    )
    
</template>

<script setup>
import { tempo } from '@use/tempo.js'
import { onKeyStroke } from '@vueuse/core'

onKeyStroke(' ', (e) => {
  e.preventDefault()
  tempo.playing = !tempo.playing
});
onKeyStroke('Enter', (e) => {
  e.preventDefault()
  tempo.stopped = true
});
</script>

<style scoped>
.border {
  stroke: #3333;
  transition: stroke 200ms ease-out;
}

.btn:hover .border {
  stroke: currentColor;
}
</style>