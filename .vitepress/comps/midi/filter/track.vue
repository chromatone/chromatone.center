<script setup>
import { noteColor } from "#use/colors"
const props = defineProps({
  track: Object,
});

const bar = reactive({
  total: computed(() => props.track.endOfTrackTicks),
  step: computed(() => 1000 / bar.total)
})


const ticks = computed(() => {
  let arr = []
  arr.length = props.track.endOfTrackTicks
  props.track.notes.forEach((note, n) => {
    arr[note.ticks] = arr[note.ticks] || []
    arr[note.ticks].push({ ...note, index: n })
  })
  return arr
});
</script>

<template lang="pug">
svg(
  class="bg-light-300 dark_bg-dark-800"
    version="1.1",
    baseProfile="full",
    :viewBox="`0 0 1000 100`",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
)
  g(v-for="(tick, t) in ticks" :key="tick" )
    line(

      :x1="t * bar.step" 
      :x2="t * bar.step" 
      y1="0" y2="100" 
      stroke="currentColor" 
      v-if="t % 64 == 0"
      :stroke-opacity="t % 128 == 0 ? 1 : 0.3" 
      :stroke-width="t % 512 == 0 ? 0.5 : t % 256 == 0 ? 0.6 : 0.3"
      )
    rect(v-for="note in tick" :key="note" 
    :x="note?.ticks * bar.step" 
    :width="note?.durationTicks * bar.step"
    height="10"
    rx="4"
    :y="note.midi"
    :fill="noteColor(note.midi + 3)")
</template>

<style lang="postcss" scoped>

</style>