<template lang="pug">
.flex.flex-col
  card(
    v-for="(area,i) in sorted", 
    :key="area.title", 
    :item="area", 
    :i="i",
    )  
</template>

<script setup>
import { computed, defineProps, reactive } from "vue";

const props = defineProps({
  areas: Object,
});

const sorted = computed(() => {
  if (!props.areas && typeof props.areas != 'array') { return }
  return [...props.areas].sort((a, b) => {
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
