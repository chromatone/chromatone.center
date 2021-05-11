<template lang="pug">
a.tile(:href="item.link", :style="{ backgroundColor: lchToHsl(i, total) }")
  // img.cover(:src="'/media/' + item.data.cover")
  .flex.flex-col.p-4
    .text-3xl.mb-4.font-bold {{ item.title }}
    .font-normal {{ item.subtitle }}
</template>

<script setup>
import { defineProps } from 'vue'
import { lchToHsl } from '@composables/colors.js'
const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});
</script>

<style lang="postcss" scoped>
.tile {
  @apply m-4 flex flex-col shadow-md transition hover:shadow-xl no-underline;
  flex: 1 1 200px;
}

.cover {
  @apply h-sm;
}
</style>