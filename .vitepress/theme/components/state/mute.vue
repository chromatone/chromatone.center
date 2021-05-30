<template lang="pug">
button.mute.p-2(@click="toggle()")
  bi-volume-up(v-if="!mute")
  bi-volume-mute(v-else)
</template>

<script setup>
import {
  watchEffect
} from 'vue'
import { getDestination } from 'tone'
import { useStorage } from '@vueuse/core'
const mute = useStorage('mute', false)

watchEffect(() => {
  getDestination().mute = mute.value
})

function toggle() {
  mute.value = !mute.value
}
</script>

<style scoped>
.mute {
  font-size: 1.1em;
}
</style>