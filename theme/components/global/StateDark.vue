<script setup>
import { useData } from 'vitepress'
const { isDark } = useData()

</script>

<template>
  <button class="p-2 text-xl" @click="isDark = !isDark" aria-label="Toggle dark mode"
    v-tooltip.right="'Toggle dark mode'">
    <div class="i-carbon-moon" v-show="isDark"></div>
    <div class="i-ion-ios-sunny" v-show="!isDark"></div>
  </button>
</template>
