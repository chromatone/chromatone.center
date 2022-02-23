<script setup>
const props = defineProps({
  rows: Object,
});

const sorted = computed(() => {
  return sortList(props.rows)
});

function sortList(list) {
  if (!list && typeof list != 'array') {
    return
  }
  return [...list].sort((a, b) => {
    if (a?.data && b?.date) {
      return a.date > b.date ? -1 : 1
    }
    if (a?.lastModified > b?.lastModified) {
      return -1
    } else {
      return 1
    }
  })
}


</script>

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

<style  scoped>
.tiles {
  @apply flex flex-col max-w-65ch mx-auto;
}
</style>
