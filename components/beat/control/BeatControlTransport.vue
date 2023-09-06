<script setup>
import { tempo } from '#/use/tempo'

</script>

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
      v-tooltip.left="'Play/pause'"
    )
    g(
      transform="translate(-2,4)"
    )
      i-la-play(
        v-if="!tempo.playing"
      )
      i-la-pause(
        v-else
      )
  g.btn.cursor-pointer(
    transform="translate(0,150)"
    v-if="!tempo.stopped"
    @click="tempo.stopped = Date.now()"
    )
      rect.border(
        v-tooltip.left="'Stop'"
        fill="transparent"
        stroke-width="4"
        x="0"
        y="0"
        rx="10"
        width="70"
        height="80"
        )
      i-la-stop(
      y="5"
    )
    
</template>

<style lang="postcss" scoped>
.border {
  stroke: #3333;
  transition: stroke 200ms ease-out;
}

.btn:hover .border {
  stroke: currentColor;
}
</style>