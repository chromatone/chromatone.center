<script setup>
import { lchToHsl } from '#/use/colors'
import { isDark } from '#/theme/composables/state'

const props = defineProps({
  cards: Object,
});

function getColor(i, total) {
  let l = isDark.value ? 40 : 60
  return lchToHsl(i, total, 1, 20, l)
}

</script>

<template lang="pug">
.list(:style="{ backgroundColor: isDark ? '#3335' : '#fff5' }")
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
  @apply bg-light-400 dark-bg-dark-400 rounded-3xl p-1 md-p-2 flex flex-col flex-auto m-1 gap-12;
}

.inset {
  @apply rounded-2xl overflow-hidden shadow-md hover-(shadow-lg);
}
</style>
