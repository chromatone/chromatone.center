<template lang="pug">
.lines(v-if="list")
  a.line(
    v-for="(line,l) in list", 
    :key="line.title",
    :href="line.link",
    ) {{ line.title }}
    counter(:list="$site.customData.pages?.[line?.data?.list]") 
    .flex-1 
    card-date(:date="line.lastModified")
    shop-price(:product="line?.data?.product")
</template>

<script setup>

import { defineProps } from 'vue'
const props = defineProps({
  list: Object,
});

import { lchToHsl } from '@composables/colors.js'
</script>

<style  scoped>
.lines {
  @apply flex flex-col mx-2 md:mx-4 mb-4;
}

.line {
  @apply flex px-4 py-2 mt-4 font-bold transition-all shadow-md bg-gray-50 dark:bg-gray-800 
  hover:(no-underline shadow-lg);
}
</style>