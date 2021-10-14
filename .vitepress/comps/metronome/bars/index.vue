<template lang="pug">
.flex.flex-col.items-center.w-full.p-4.has-bg.rounded-xl#screen
  client-only 
    state-transport
    metronome-bars-bar(
      v-for="(loop,i) in loops",
      :key="loop"
      :order="i"
      :loop="loop"
      :maxRatio="maxRatio"
      @del="loops.splice(i, 1)"
      @over="loop.over = clampNum(loop.over, $event, 1, 32)"
      @under="loop.under = clampNum(loop.under, $event, 1, 32)"
      @sound="loop.sound = $event"
      :editable="!meters"
    )
    .flex.flex-wrap
      button.text-button.text-4xl(
        @click="loops.push({ ...newLoop })"
        v-if="!meters"
      )
        la-plus
      button.text-button.text-xl(
        v-for="meter in meters"
        @click="loops = [{ over: meter.split('/')[0], under: meter.split('/')[1], sound: 'A', volume: 1 }]"
      ) {{ meter }}
</template>

<script setup>
import { clampNum } from '@use/theory'

const props = defineProps({
  meters: {
    type: Array,
    default: null
  }
})

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

if (props.meters) {
  let nums = props.meters[0].split('/')
  loops.value = [{
    over: nums[0],
    under: nums[1],
    volume: 1,
    sound: 'A'
  }]
}


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

</script>

<style scoped>
</style>