<template lang="pug">
button.icon-button.p-2(@click="toggle" aria-label="Toggle dark mode")
  carbon-moon(v-show="isDark")
  ion-ios-sunny(v-show="!isDark")
</template>

<script setup lang='ts'>
import { useToggle, useDark } from '@vueuse/core'
const isDark = useDark()

const toggle = useToggle(isDark);
</script>
