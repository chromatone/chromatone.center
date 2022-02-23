<script setup>


const props = defineProps({
  rows: Object,
});

import { lchToHsl } from '@use/colors.js'
import { isDark } from '@theme/composables/state'
function getColor(i, total) {
  let l = isDark.value ? 40 : 60
  return lchToHsl(i, total, 1, 20, l)
}



</script>

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

<style  scoped>
.list {
  @apply bg-light-400 mt-2 dark_bg-dark-400 rounded-3xl p-2 md_p-4 flex flex-col flex-auto;
}

.inset {
  @apply rounded-2xl overflow-hidden shadow-md mx-1 my-6 sm_(mx-2) md_(mx-4) lg_(my-8) hover_(shadow-lg);
}
</style>
