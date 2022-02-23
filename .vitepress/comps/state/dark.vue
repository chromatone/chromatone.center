<script setup>
import { isDark } from '@theme/composables/state.js'

</script>

<template lang="pug">
button.icon-button.p-2(@click="isDark = !isDark" aria-label="Toggle dark mode")
  carbon-moon(v-show="isDark")
  ion-ios-sunny(v-show="!isDark")
</template>
