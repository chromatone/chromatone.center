<template lang="pug">
.flex.flex-col.max-w-55ch.mx-auto
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

const props = defineProps({
  rows: Object,
});

const sorted = computed(() => {
  if (!props.rows && typeof props.rows != 'array') { return }
  return [...props.rows].sort((a, b) => {
    if (a.data?.order && b.data?.order) {
      let ord = a.data.order < b.data.order ? -1 : 1
      return ord
    }
    if (a?.lastModified > b?.lastModified) {
      return -1
    } else {
      return 1
    }
  })
});




</script>

<style lang="postcss" scoped>
</style>
