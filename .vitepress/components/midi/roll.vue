<template lang="pug">
.flex.flex-col.items-center
  state-midi-panel
  .flex
    p ROll {{ score.startTime }} - {{ score.endTime }}
  svg(
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0 300 100`",
  xmlns="http://www.w3.org/2000/svg",
  )

</template>

<script setup>
import { defineProps, reactive, watch } from 'vue'
import { midi } from '@use/midi.js'

const score = reactive({
  channels: {},
  startTime: Date.now(),
  endTime: Date.now(),
})

watch(() => midi.playing, playing => {
  if (playing) {
    score.startTime = midi.note?.timestamp || Date.now()
  } else {
    score.endTime = midi.note?.timestamp || Date.now()
  }
});

</script>

<style scoped>
</style>