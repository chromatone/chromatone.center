<template lang="pug">
.tiles
  tile-item(
    v-for="(area,i) in sorted", 
    :key="area.title", 
    :item="area", 
    :i="i",
    :total="sorted.length",
    v-motion,
    :initial="{ opacity: 0, y: 40 }",
    :enter="{ opacity: 0, y: 0, scale: 1 }",
    :visible="{ opacity: 1, y: 0, scale: 1 }",
    :delay="i * 80",
    )  
</template>

<script setup>
import { computed, defineProps, reactive } from "vue";
import { sortList } from '@composables/list.js'
const props = defineProps({
  rows: Object,
});

const sorted = computed(() => {
  return sortList(props.rows)
});


</script>

<style lang="postcss" scoped>
.tiles {
  @apply flex flex-wrap max-w-55ch mx-auto;
}
</style>
