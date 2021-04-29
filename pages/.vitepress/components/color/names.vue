<template lang="pug">
.overflow-y-scroll.w-full
  table.text-center.w-full
    tr.bg-gray-200.bg-opacity-20
      th #
      th.p-4(v-for="(lang) in langs", :key="lang") {{ lang }} 
    tr(v-for="(color, n,i) in list", :key="n", :style="{ backgroundColor: levelColor(i, 12) }")
      td {{ i + 1 }}
      td.p-4(v-for="name in color") {{ name }} 
</template>

<script setup>
import { defineProps } from 'vue'
import { levelColor } from '@composables/colors.js'
const props = defineProps({
  list: Object,
  langs: Object,
});
</script>

<style  scoped>
</style>