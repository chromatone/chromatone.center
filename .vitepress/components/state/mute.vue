<template lang="pug">
button.mute.p-2(@click="mute = !mute")
  bi-volume-up(v-if="!mute")
  bi-volume-mute(v-else)
</template>

<script setup>
import { mute } from '@use/synth.js'
</script>

<style scoped>
.mute {
  font-size: 1.1em;
}
</style>