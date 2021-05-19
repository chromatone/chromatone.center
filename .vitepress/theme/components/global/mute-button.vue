<template lang="pug">
button.icon-button(@click="toggle()")
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
</style>