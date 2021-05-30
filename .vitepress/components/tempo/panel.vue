<template lang="pug">
.flex.flex-col.max-w-65ch.m-auto.items-center
  .flex.flex-wrap
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
    .button(@click="tempo.bpm = Math.round(tempo.bpm) / 2")
      la-slash
      span 2
    .button(@click="tempo.bpm = Math.round(tempo.bpm) * 2")
      la-times
      span 2
  .flex.items-center
    tempo-tap.button
    tempo-listen.button(@set="tempo.bpm = $event")
    .info.transition-all.duration-60(
      :style="{ backgroundColor: tempo.blink ? 'currentColor' : 'transparent' }"
    ) {{ tempo.hz }} Hz
    .info.border-current(
      :style="{ color: tempo.color }"
    ) {{ tempo.note }}

  .flex.items-center
    .button(@click="tempo.playing = !tempo.playing")
      la-play(v-if="!tempo.playing")
      la-pause(v-else)  
    .button(@click="tempo.stopped = true")
      la-stop
</template>

<script setup>
import { useTempo } from '@use/tempo.js'
import { onKeyStroke } from '@vueuse/core'
const tempo = useTempo();

onKeyStroke(' ', (e) => {
  e.preventDefault()
  tempo.playing = !tempo.playing
});


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