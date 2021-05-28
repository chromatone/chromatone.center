<template lang="pug">
.flex.flex-col.max-w-65ch.m-auto.items-center


  .flex
    .button(@click="tempo.bpm--")
      la-minus
    .info.flex
      input.w-4rem.bg-transparent(type="number",v-model="tempo.bpm")
      .ml-2 BPM
    .button(@click="tempo.bpm++")
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
    .info
      input.bg-transparent.w-3rem(type="number", v-model="tempo.metre.over")
    .info /
    .info {{ tempo.metre.under }}
  .flex.flex-col.items-stretch
    tempo-row.m-auto
    svg.max-h-3xl.w-full(
      version="1.1",
      baseProfile="full",
      viewBox="0 0 1000 1000",
      xmlns="http://www.w3.org/2000/svg",
      )

</template>

<script setup>
import { useTempo } from '@use/tempo.js'

const tempo = useTempo();

</script>

<style scoped>
.button {
  @apply p-4 border-1 m-1 cursor-pointer shadow rounded text-2xl;
}

.info {
  @apply p-4 rounded m-1 border-1 text-2xl;
}

.active {
  @apply bg-current transition-all duration-400;
}
</style>