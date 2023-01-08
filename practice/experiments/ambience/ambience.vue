<script setup>
import Drone from './layers/drone.vue';
import Noise from './layers/noise.vue';
import arp from './layers/arp.vue';
import SimplexPaper from './paper/simplexPaper.vue';
</script>

<template lang='pug'>
.flex.flex-col.gap-6.items-center
  simplex-paper
  noise.p-2.rounded-xl.w-full.shadow-xl.bg-light-800.dark-bg-dark-200
  drone.p-2.rounded-xl.w-full.shadow-xl.bg-light-800.dark-bg-dark-200
  arp.p-2.rounded-xl.w-full.shadow-xl.bg-light-800.dark-bg-dark-200
</template>

<style lang="postcss" scoped>
.active {
  @apply bg-dark-100 text-light-200 dark-bg-light-200 dark-text-dark-200;
}
</style>