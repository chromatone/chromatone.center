<template lang="pug">
.lines(v-if="list")
  card-box.my-2(
    v-for="(line,l) in list", 
    :key="line.title",
    :i="l"
    :total="Object.keys(list).length"
    :height="1"
    v-slot="{ color }"
  )
    a.line(
      :style="{ color: color }"
      :href="line.link",
      ) {{ line.title }}
      counter(:list="site.customData.pages?.[line?.data?.list]") 
      .flex-1 
      card-date(:date="line.lastModified")
      shop-price.ml-2(:product="line?.data?.product", :showButton="false")
</template>

<script setup>
import { useData } from 'vitepress'
const { site } = useData()
const props = defineProps({
  list: Object,
});
</script>

<style  scoped>
.lines {
  @apply flex flex-col mx-2 md:mx-4 my-4;
}

.line {
  @apply flex items-center px-4 py-2 font-bold transition-all shadow-md bg-gray-50 dark:bg-gray-800 
  hover:(no-underline shadow-lg);
}
</style>