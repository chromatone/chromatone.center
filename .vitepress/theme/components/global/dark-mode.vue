<template lang="pug">
button.icon-button(@click="toggle")
  carbon-moon(v-show="isDark")
  ion-ios-sunny(v-show="!isDark")
</template>

<script setup lang='ts'>
import { useToggle, useDark } from '@vueuse/core'
const isDark = useDark()

const toggle = useToggle(isDark);
</script>
