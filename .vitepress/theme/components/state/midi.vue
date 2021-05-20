<template lang="pug">
button.icon-button.mute
  mdi-midi-input(
    :style="{ opacity: isSupported ? 1 : 0.2 }"
  )
</template>

<script setup>
import { ref } from 'vue'

const isSupported = ref(!!navigator.requestMIDIAccess)


function toggle() {
  mute.value = !mute.value
}
</script>

<style scoped>
</style>