<template lang="pug">
.flex.flex-col.items-center.w-full
  svg#metronome.w-full.my-8.max-h-90vh(
    version="1.1",
    baseProfile="full",
    :viewBox="`0 0 ${box.width} ${box.height}`",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
    )
    metronome-math(
      transform="translate(30,40)"
    )
    g(
      transform="translate(-100,0)"
    )
    metronome-transport(
      transform="translate(550,-30)"
    )
    metronome-listen(
      transform="translate(750,20)"
    )
    metronome-tap(
      transform="translate(310,20)"
      )
    metronome-bars-bar(
      v-for="(loop,i) in loops",
      :key="i"
      :order="i"
      :transform="`translate(0, ${150 + i * 300})`"
      :loop="loop"
      :maxRatio="maxRatio"
      @del="loops.splice(i, 1)"
      @over="loop.over += $event"
      @under="loop.under += $event"
      @sound="loop.sound = $event"
    )
    g.cursor-pointer.opacity-60.transition-all.duration-200.ease(
      @click="loops.push({ ...newLoop })"
      class="hover:opacity-100"
      :transform="`translate(0, ${150 + loops.length * 300})`"
    )
      rect(
        width="1000"
        height="100"
        fill="#3333"
        rx="15"
      )
      la-plus(
        font-size="60"
        y="10"
        x="500"
        text-anchor="middle"
      )
</template>

<script setup>
const box = reactive({
  width: 1000,
  height: computed(() => loops.value.length * 300 + 250),
});
import { useTempo, tap } from '@use/tempo.js'
const tempo = useTempo()

import { useTuner } from '@use/tuner.js'
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

const newLoop = reactive({
  over: 4,
  under: 4,
  volume: 1,
  sound: 'A'
})

const maxRatio = computed(() => {
  let max = 0
  loops.value.forEach(loop => {
    let ratio = loop.over / loop.under
    if (ratio > max) {
      max = ratio
    }
  })
  return max
})

function changeLoop(l, n, diff) {
  let num = loops.value[l][n] + diff
  if (num >= 1 && num <= 32) {
    loops.value[l][n] = num
  }
}

const overlay = ref(false);

</script>

<style scoped>
</style>