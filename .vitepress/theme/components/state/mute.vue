<template lang="pug">
button.mute.p-2(@click="toggle()")
  bi-volume-up(v-if="!mute")
  bi-volume-mute(v-else)
</template>

<script setup>
import { mute } from '@use/synth.js'

function toggle() {
  mute.value = !mute.value
}
</script>

<style scoped>
.mute {
  font-size: 1.1em;
}
</style>