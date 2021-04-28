<template lang="pug">
.flex.flex-col.max-w-55ch.mx-auto
  row-block(
    v-for="(area,i) in sorted", 
    :key="area.title", 
    :item="area", 
    :i="i",
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
</style>
