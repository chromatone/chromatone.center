<script setup>
import { levelColor } from '#/use/colors'
const props = defineProps({
  list: Object,
  langs: Object,
});
</script>

<template lang="pug">
.overflow-y-scroll.w-full.my-16.max-w-100vw
  table.text-center.w-full
    tr.bg-gray-200.bg-opacity-20
      th #
      th Hue
      th.p-4(v-for="(lang) in langs", :key="lang") {{ lang }} 
    tr(v-for="(color, n, i) in list", :key="n", :style="{ backgroundColor: levelColor(i, 12) }")
      td {{ i + 1 }}
      td {{ i * 30 }}º
      td.p-4(v-for="name in color") {{ name }} 
</template>

<style lang="postcss" scoped>

</style>