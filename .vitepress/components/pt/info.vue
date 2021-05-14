<template lang="pug">
.flex.flex-col.text-xs.p-1(v-if="state.show.hz || state.show.bpm || state.show.letters")
  .text-xl.font-bold(v-if="state.show.letters") {{ name }}{{ octave }}
  .flex(v-if="state.show.hz") {{ round(hz) }}hz
  .flex(v-if="state.show.bpm") {{ round(bpm) }}BPM
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { state } from './state'

const props = defineProps({
  name: {
    type: String,
    default: 'A'
  },
  hz: {
    type: Number,
    default: 440
  },
  octave: {
    default: 3,
    type: Number,
  }
});

const bpm = computed(() => {
  return (props.hz * 60)
})

function round(value) {
  let result
  if (value > 1e6) {
    result = (value / 1e6).toFixed(2) + ' M'
  } else if (value > 1e3) {
    result = (value / 1e3).toFixed(2) + ' k'
  } else {
    result = value.toFixed(2) + ' '
  }
  return result
}

</script>

<style scoped>
</style>