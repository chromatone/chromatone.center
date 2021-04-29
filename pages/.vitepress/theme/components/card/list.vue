<template lang="pug">
.list
  card(
    v-for="(area,i) in sorted", 
    :key="area.title", 
    :item="area", 
    :i="i",
    :total="sorted.length",
    )  
</template>

<script setup>
import { computed, defineProps, reactive } from "vue";

const props = defineProps({
  rows: Object,
});

const sorted = computed(() => {
  if (!props.rows && typeof props.rows != 'array') { return }
  return [...props.rows].sort((a, b) => {
    if (a?.lastModified > b?.lastModified) {
      return -1
    } else {
      return 1
    }
  })
});

</script>

<style lang="postcss" scoped>
.list {
  @apply mx-2 md:mx-4 my-2 flex flex-col flex-auto;
}
</style>
