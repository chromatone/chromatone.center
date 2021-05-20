<template lang="pug">
button.icon-button.mute(@click="toggle()")
  bi-volume-up(v-if="!mute")
  bi-volume-mute(v-else)
</template>

<script setup>
import { mute } from '../../composables/state.js'

function toggle() {
  mute.value = !mute.value
}
</script>

<style scoped>
.icon-button.mute {
  font-size: 1.1em;
}
</style>