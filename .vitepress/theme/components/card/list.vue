<template lang="pug">
.list
  card-item.inset(
    v-for="(area,i) in rows", 
    :key="area.title", 
    :item="area", 
    :color="getColor(i, rows.length)"
    )
    slot
</template>

<script setup>
import { lchToHsl } from '@use/colors.js'
import { isDark } from '@theme/composables/state'

const props = defineProps({
  rows: Object,
});

function getColor(i, total) {
  let l = isDark.value ? 40 : 60
  return lchToHsl(i, total, 1, 20, l)
}



</script>

<style  scoped>
.list {
  @apply bg-light-400 mt-2 dark:bg-dark-400 rounded-3xl p-2 md:p-4 flex flex-col flex-auto;
}

.inset {
  @apply rounded-2xl overflow-hidden shadow-md mx-1 my-5 sm:(mx-2) md:(mx-4) lg:(my-8) hover:(shadow-lg);
}
</style>
