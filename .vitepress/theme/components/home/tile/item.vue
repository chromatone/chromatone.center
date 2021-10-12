<template lang="pug">
a.tile(:href="item.link", :style="{ color: color }")
  // img.cover(:src="'/media/' + item.data.cover")
  .flex.flex-col.p-4
    .text-3xl.mb-4.font-bold {{ item.title }}
    .font-normal {{ item.subtitle }}
</template>

<script setup>
import { lchToHsl } from '@use/colors.js'
const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});
const color = computed(() => lchToHsl(props.i, props.total));
const shadow = computed(() => `0 0 0 2px ${color.value}, 0 6px 0 2px ${color.value}`);
const hoverShadow = computed(() => `0 0 0 2px ${color.value}, 0 12px 0 4px ${color.value}`);
</script>

<style scoped>
.tile {
  @apply bg-light-100 dark:bg-dark-700 m-4 flex flex-col transition no-underline rounded-xl;
  box-shadow: v-bind(shadow);
  flex: 1 1 250px;
  &:hover {
    box-shadow: v-bind(hoverShadow);
  }
}

.cover {
  @apply h-sm;
}
</style>