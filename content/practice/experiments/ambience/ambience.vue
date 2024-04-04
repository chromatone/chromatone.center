<script setup>
import Drone from './layers/drone.vue';
import Noise from './layers/noise.vue';
import arp from './layers/arp.vue';
import SimplexPaper from './paper/simplexPaper.vue';
</script>

<template lang="pug">
.flex.flex-wrap.gap-6.items-stretch
  simplex-paper
  noise.p-2.rounded-xl.w-full.shadow-xl.bg-light-800.dark-bg-dark-200(style="flex: 1 1 320px")
  drone.p-2.rounded-xl.w-full.shadow-xl.bg-light-800.dark-bg-dark-200(style="flex: 1 1 320px")
  arp.p-2.rounded-xl.w-full.shadow-xl.bg-light-800.dark-bg-dark-200(style="flex: 1 1 320px")
</template>

<style lang="postcss" scoped>
.active {
  @apply bg-dark-100 text-light-200 dark-bg-light-200 dark-text-dark-200;
}
</style>