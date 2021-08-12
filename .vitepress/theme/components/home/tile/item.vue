<template lang="pug">
a.tile(:href="item.link", :style="{ color: color, boxShadow: `0 0 0 2px ${color}, 0 8px 0 2px ${color}` }")
  // img.cover(:src="'/media/' + item.data.cover")
  .flex.flex-col.p-4
    .text-3xl.mb-4.font-bold {{ item.title }}
    .font-normal {{ item.subtitle }}
</template>

<script setup>
import { lchToHsl } from '@theme/composables/colors.js'
const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});
const color = computed(() => lchToHsl(props.i, props.total));
</script>

<style scoped>
.tile {
  @apply bg-light-200 dark:bg-dark-300 m-4 flex flex-col transition no-underline;
  flex: 1 1 200px;
}

.cover {
  @apply h-sm;
}
</style>