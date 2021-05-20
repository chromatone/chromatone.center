<template lang="pug">
button.icon-button.mute
  mdi-midi-input(
    :style="{ color: 'hsla(0,0%,50%,0.5)' }"
  )
</template>

<script setup>


function toggle() {
  mute.value = !mute.value
}
</script>

<style scoped>
</style>