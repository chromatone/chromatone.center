<template lang="pug">
.flex.flex-col.max-w-65ch.m-auto.items-center


  .flex
    .button(@click="tempo.bpm = Math.round(tempo.bpm - 1)")
      la-minus
    .info.flex
      input.w-4rem.bg-transparent(
        inputmode="numeric"
        pattern="[0-9]*"
        type="number",
        v-model="tempo.bpm"
        )
      .ml-2 BPM
    .button(@click="tempo.bpm = Math.round(tempo.bpm + 1)")
      la-plus
  .flex.items-center
    tempo-listen.button(@set="tempo.bpm = $event")
    .info.transition-all.duration-60(
      :style="{ backgroundColor: tempo.blink ? 'currentColor' : 'transparent' }"
    ) {{ tempo.hz }} Hz
    .info(
      :style="{ backgroundColor: tempo.color }"
    ) {{ tempo.note }}
  .flex.items-center
    .button(@click="tempo.playing = !tempo.playing")
      la-play(v-if="!tempo.playing")
      la-pause(v-else)  
    .button(@click="tempo.stopped = true")
      la-stop
  .flex
    .button(@click="tempo.metre.over--")
      la-minus
    .info
      input.bg-transparent.w-3rem(
        inputmode="numeric"
        pattern="[0-9]*"
        type="number", 
        v-model="tempo.metre.over"
        )
      span.ml-2 /
      span {{ tempo.metre.under }}
    .button(@click="tempo.metre.over++")
      la-plus
  tempo-row

</template>

<script setup>
import { useTempo } from '@use/tempo.js'

const tempo = useTempo();

</script>

<style scoped>
.button {
  @apply p-4 border-1 m-1 cursor-pointer shadow-md rounded text-2xl;
}

.info {
  @apply p-4 rounded m-1 border-1 text-2xl;
}

.active {
  @apply bg-current transition-all duration-400;
}
</style>