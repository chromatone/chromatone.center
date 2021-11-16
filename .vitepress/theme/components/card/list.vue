<template lang="pug">
.list
  card-box.my-4(
    v-for="(area,i) in rows", 
    :key="area.title", 
    :i="i"
    :total="rows.length"
    :height="2"
    v-slot="{ color }"
  )
    card-item(
      :item="area", 
      :color="color"
      )  
</template>

<script setup>
import { computed, reactive } from "vue";

const props = defineProps({
  rows: Object,
});


</script>

<style  scoped>
.list {
  @apply bg-light-400 mt-2 dark:bg-dark-400 rounded-3xl p-2 md:p-4 flex flex-col flex-auto;
}
</style>
