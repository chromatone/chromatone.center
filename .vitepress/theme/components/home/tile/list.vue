<template lang="pug">
.tiles
  home-tile-item(
    v-for="(area,i) in sorted", 
    :key="area.title", 
    :item="area", 
    :i="i",
    :total="sorted.length",
    )  
</template>

<script setup>
import { computed, reactive } from "vue";
import { sortList } from '@theme/composables/list.js'
const props = defineProps({
  rows: Object,
});

const sorted = computed(() => {
  return sortList(props.rows)
});


</script>

<style  scoped>
.tiles {
  @apply flex flex-wrap max-w-55ch mx-auto;
}
</style>
