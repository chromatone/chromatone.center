<template lang="pug">
.flex.flex-col.items-center.w-full.px-8(ref="bars")
  svg#metronome.w-full.my-8(
    version="1.1",
    baseProfile="full",
    :viewBox="`0 0 ${box.width} ${box.height}`",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"

    )
    metronome-math(
      transform="translate(30,40)"
    )
    g.cursor-pointer(
      @click="toggle()"
      font-size="30"
      transform="translate(180,70)"
    )
      rect(
        y="-7"
        x="-7"
        rx='10'
        width="50"
        height="50"
        fill="transparent"
        stroke="currentColor"
      )
      la-expand
    metronome-bars-controls(
      transform="translate(255,20)"
    )
    metronome-tap(
      transform="translate(370,20)"
      )
    metronome-transport(
      transform="translate(600,-30)"
    )
    metronome-listen(
      transform="translate(790,20)"
    )

    metronome-bars-bar(
      v-for="(loop,i) in loops",
      :key="i"
      :order="i"
      :transform="`translate(0, ${150 + i * 350})`"
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
      :transform="`translate(0, ${140 + loops.length * 350})`"
    )
      rect(
        x="50"
        width="900"
        height="100"
        fill="#3333"
        stroke="currentColor"
        stroke-width="3"
        rx="45"
      )
      la-plus(
        font-size="60"
        y="10"
        x="480"
        text-anchor="middle"
      )
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'
import { useTempo, tap } from '@use/tempo.js'
import { useTuner } from '@use/tuner.js'

const bars = ref(null)

const { isFullscreen, enter, exit, toggle } = useFullscreen(bars)

const box = reactive({
  width: 1000,
  height: computed(() => loops.value.length * 330 + 320),
});

const tempo = useTempo()


const { init, tuner } = useTuner();

const loops = useStorage('tempo-bar-loops', [
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