<script setup>
import Drone from './layers/drone.vue';
import Noise from './layers/noise.vue';
import arp from './layers/arp.vue';
import SimplexPaper from './paper/simplexPaper.vue';
</script>

<template lang='pug'>
.flex.flex-col.gap-4.items-center
  simplex-paper
  noise.border-1.p-2.rounded-xl.w-full.border-current
  drone.border-1.p-2.rounded-xl.w-full.border-current
  arp.border-1.p-2.rounded-xl.w-full.border-current
</template>

<style lang="postcss" scoped>
.active {
  @apply bg-dark-100 text-light-200 dark_bg-light-200 dark_text-dark-200;
}
</style>