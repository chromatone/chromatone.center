<script setup>
import { isDark } from '#/theme/composables/state'

</script>

<template lang="pug">
button.p-2.text-xl(@click="isDark = !isDark" aria-label="Toggle dark mode")
  .i-carbon-moon(v-show="isDark")
  .i-ion-ios-sunny(v-show="!isDark")
</template>
