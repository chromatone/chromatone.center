<template lang="pug">
.lines(v-if="list")
  a.line(
    v-for="(line,l) in list", 
    :key="line.title",
    :href="line.link",
    :style="{ borderColor: lchToHsl(l, list.length) }"
    ) {{ line.title }}
    counter(:list="$site.customData.pages?.[line?.data?.list]") 
    .flex-1 
    card-date(:date="line.lastModified")
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
  @apply flex flex-col md:mx-4 mx-2 mb-2;
}

.line {
  @apply flex px-4 py-2 my-2 font-bold border-l-4 transition-all shadow-md 
  hover:(no-underline shadow-lg);
}
</style>