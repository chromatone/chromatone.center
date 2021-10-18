<template lang="pug">
.lines(v-if="list")
  card-box.m-2(
    v-for="(line,l) in list", 
    :key="line.title",
    :i="l"
    :total="Object.keys(list).length"
    :height="2"
    v-slot="{ color }"
  )
    a.line(
      :href="line.link",
      ) {{ line.title }}
      counter(:list="theme.pages?.[line?.data?.list]") 
      card-date.flex-1.ml-4(:date="line.lastModified")
      shop-price.ml-2(:product="line?.data?.product", :showButton="false")
</template>

<script setup>
import { useData } from 'vitepress'
const { theme } = useData()
const props = defineProps({
  list: Object,
});
</script>

<style  scoped>
.lines {
  @apply flex flex-wrap mx-2  my-4 w-full;
}

.line {
  @apply flex rounded-xl font-normal items-center px-4 py-2 transition-all bg-gray-50 dark:bg-gray-800 
  hover:(no-underline );
}
</style>