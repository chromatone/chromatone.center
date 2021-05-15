<template lang="pug">
.flex.flex-col
  .flex {{ state.enabled }}
  .flex
    .p-2.m-2.border(v-for="input in state.input") 
      .font-bold {{ input.name }}
      .play(v-if="input.playing !== null")
        la-play(v-if="input.playing")
        la-pause(v-else)
      .text-gray-200 

</template>

<script setup>
import { defineProps, reactive, onBeforeUnmount, onMounted } from 'vue'
import { WebMidi } from 'webmidi'

const state = reactive({
  enabled: false,
  input: {},
  output: {},
})

WebMidi.enable()

WebMidi.addListener('enabled', e => {
  state.enabled = true

})

WebMidi.addListener('connected', e => {
  state[e.port.type][e.port.id] = {
    name: e.port.name,
    manufacturer: e.port.manufacturer,
    playing: null,
  }
  e.port.addListener('start', () => {
    state[e.port.type][e.port.id].playing = true
  })
  e.port.addListener('stop', () => {
    state[e.port.type][e.port.id].playing = false
  })
  console.log(e.port)
})

WebMidi.addListener('disconnected', e => {
  delete state[e.port.type][e.port.id]
})



onBeforeUnmount(() => {
  WebMidi.disable()
});

</script>

<style scoped>
</style>