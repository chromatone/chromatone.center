<script setup>
import { lchToHsl } from '#/use/colors'
import { useData } from 'vitepress'
const { isDark } = useData()

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
  slot
  card-item.inset(
    v-for="(card, i) in cards", 
    :key="card.title", 
    :item="card", 
    :color="getColor(i, cards.length)"
    )

</template>

<style lang="postcss" scoped>
.list {
  @apply bg-light-400 dark-bg-dark-400 rounded-3xl p-1 md-p-2 flex flex-col flex-auto m-1 gap-8;
}

.inset {
  @apply rounded-md overflow-hidden shadow-md hover-(shadow-lg);
}
</style>
