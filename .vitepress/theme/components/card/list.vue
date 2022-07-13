<script setup>
import { lchToHsl } from '#use/colors.js'
import { isDark } from '#theme/composables/state'

const props = defineProps({
  cards: Object,
});

function getColor(i, total) {
  let l = isDark.value ? 40 : 60
  return lchToHsl(i, total, 1, 20, l)
}

</script>

<template lang="pug">
.list
  card-item.inset(
    v-for="(card, i) in cards", 
    :key="card.title", 
    :item="card", 
    :color="getColor(i, cards.length)"
    )
    slot
</template>

<style lang="postcss" scoped>
.list {
  @apply bg-light-400 mt-2 dark_bg-dark-400 rounded-3xl p-2 md_p-4 flex flex-col flex-auto;
}

.inset {
  @apply rounded-2xl overflow-hidden shadow-md mx-1 my-6 sm_(mx-2) md_(mx-4) lg_(my-8) hover_(shadow-lg);
}
</style>
