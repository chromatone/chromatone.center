<template lang="pug">
.flex.flex-col.items-center.w-full
  svg#metronome.w-full.my-8.max-h-90vh(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 1000 1000",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
    )
    metronome-math(
      transform="translate(30,80)"
    )
    metronome-listen(
      transform="translate(20,880)"
    )
    metronome-tap(
      transform="translate(760,880)"
      )
    metronome-transport(
      transform="translate(800)"
    )
    metronome-circle-loop(
      v-for="(loop,i) in loops",
      :key="i"
      :order="i"
      :loop="loop"
      :radius="380 - i * 175"
      @del="loops.splice(i, 1)"
      @over="changeLoop(i, 'over', $event)"
      @under="changeLoop(i, 'under', $event)"
      @sound="loop.sound = $event"
    )
    g.question.cursor-pointer(
      transform="translate(20,780)"
      @click="overlay = true"
    )
      rect(
        width="70"
        height="80"
        stroke="currentColor"
        fill="transparent"
        rx="10"
        stroke-width="4"
        )
      g.icon(
        font-size="45"
        fill="currentColor"
        transform="translate(6,12)"
      )
        healthicons-question
    metronome-circle-overlay.cursor-pointer(
      v-if="overlay"
      @click="overlay = false"
      )
</template>

<script setup>
import { useTempo, tap } from '@use/tempo.js'
import { useTuner } from '@use/tuner.js'

const tempo = useTempo()
const { init, tuner } = useTuner();

const loops = useStorage('tempo-loops', [
  {
    over: 8,
    under: 8,
    volume: 1,
    sound: 'A'
  },
  {
    over: 3,
    under: 3,
    volume: 0.5,
    sound: 'B'
  }]);

function changeLoop(l, n, diff) {
  let num = loops.value[l][n] + diff
  if (num >= 1 && num <= 32) {
    loops.value[l][n] = num
  }
}

const overlay = ref(false);
</script>

<style scoped>
.button {
  @apply p-2 border-1 m-1 cursor-pointer shadow-md rounded text-2xl;
}
.info {
  @apply p-2 rounded m-1 text-2xl flex items-center;
}

.active,
.measure.active {
  @apply bg-current transition-all duration-400;
}

.measure {
  background-color: hsla(0, 0%, 50%, 0.5);
}
</style>