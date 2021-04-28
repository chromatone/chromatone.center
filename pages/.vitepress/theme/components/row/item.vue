<template lang="pug">
.ml-2.p-2.flex
  .text-xl.font-bold {{ item.title }}
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  item: Object
});
</script>

<style lang="stylus" scoped>

</style>