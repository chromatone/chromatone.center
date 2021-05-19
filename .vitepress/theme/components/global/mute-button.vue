<template lang="pug">
.flex.cursor-pointer(@click="toggle()")
  la-volume-up(
    v-if="!mute"
  )
  la-volume-mute(
    v-else
  )
</template>

<script setup>
import { useStorage } from '@vueuse/core'
const mute = useStorage('mute-app', false);
function toggle() {
  console.log('here')
  mute.value = !mute.value
}
</script>

<style scoped>
</style>