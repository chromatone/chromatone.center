<template lang="pug">
#screen.flex.flex-col.items-center.w-full.relative.pb-12.p-4.has-bg
  full-screen.absolute.bottom-0.right-0
  svg#metronome.w-full.max-h-90vh(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 1000 1000",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
    )
    beat-control-math(
      transform="translate(20,50)"
    )
    beat-control-listen(
      transform="translate(10,900)"
    )
    beat-control-tap(
      transform="translate(785,900)"
      )
    beat-control-transport(
      transform="translate(910,-30)"
    )
    beat-control-button(
      @click="overlay = true"
      transform="translate(10,750)"
    )
      healthicons-question
    beat-control-button(
      @click="renderMidi()"
      transform="translate(925,750)"
    )
      la-file-download

    beat-circle-loop(
      v-for="(loop,i) in loops",
      :key="i"
      :order="i"
      :loop="loop"
      :radius="380 - i * 200"
      :size="200"
      @del="loops.splice(i, 1)"
      @over="changeLoop(i, 'over', $event)"
      @under="changeLoop(i, 'under', $event)"
      @sound="loop.sound = $event"
    )
    beat-circle-center(
      transform="translate(500,500) scale(0.75)"
    )

    beat-circle-overlay.cursor-pointer(
      v-if="overlay"
      @click="overlay = false"
      )
</template>

<script setup>
import { renderMidi } from '@use/sequence'
const loops = useStorage('tempo-circle-loops', [
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
  }]
);

function changeLoop(l, n, val) {
  let num = val
  if (num >= 1 && num <= 48) {
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