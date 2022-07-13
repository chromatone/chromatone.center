<script setup>
import { tempo } from '#use/tempo.js'
import { useTuner } from '#use/tuner.js'
const { init, tuner } = useTuner();

</script>

<template lang="pug">
g.listen(
  font-size="45"
  @click="!tuner.initiated ? init() : null"
)
  g.ear(@click="tuner.listen = !tuner.listen")
    rect(
      width="70"
      height="80"
      :stroke="tuner.listen ? 'currentColor' : '#3333'"
      fill="transparent"
      rx="10"
      stroke-width="4"
      v-tooltip.right="'Guess tempo from audio input'"
    )
    g.icon(
      transform="translate(6,12)"
    )
      tabler-ear(v-if="!tuner.listen")
      tabler-ear-off(v-else)
  g.bpm.transition-all.duration-200.ease-out(
    @click="tempo.bpm = tuner.bpm"
    v-if="tuner.listen"
  )
    rect(
      x="80"
      width="100"
      height="80"
      rx="10"
      stroke-width="4"
      fill="transparent"
      :stroke="tuner.blink ? 'currentColor' : '#33333333'"
    )
    text(
      fill="currentColor"
      font-size="36"
      y="52"
      x="130"
      text-anchor="middle"
    ) {{ tuner.bpm.toFixed(1) }}
</template>

<style lang="postcss" scoped>
.listen {
  @apply cursor-pointer;
}
</style>