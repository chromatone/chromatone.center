<template lang="pug">
.list-blocks
  row-block(
    v-for="(area,i) in sorted", 
    :key="area.title", 
    :item="area", 
    :i="i",
    :total="sorted.length"
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
})


</script>

<style lang="postcss" scoped>
.list-blocks {
  @apply flex flex-col max-w-65ch mx-auto;
}
</style>
