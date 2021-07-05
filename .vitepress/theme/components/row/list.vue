<template lang="pug">
.list-blocks
  row-block(
    v-for="(area,i) in rows", 
    :key="area.title", 
    :item="area", 
    :i="i",
    :total="rows.length"
    )  
</template>

<script setup>
import { computed, reactive } from "vue";
const props = defineProps({
  rows: Object,
});

</script>

<style  scoped>
.list-blocks {
  @apply flex flex-col max-w-65ch mx-auto;
}
</style>
