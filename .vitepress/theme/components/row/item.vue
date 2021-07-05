<template lang="pug">
.ml-2.p-2.flex
  .text-xl.font-bold {{ item.title }}
</template>

<script setup>
const props = defineProps({
  item: Object
});
</script>

<style  scoped>
</style>