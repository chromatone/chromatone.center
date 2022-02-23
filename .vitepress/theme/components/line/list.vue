<script setup>
import { useData } from 'vitepress'
const { theme } = useData()
const props = defineProps({
  list: Object,
});



import { lchToHsl } from '@use/colors.js'
import { isDark } from '@theme/composables/state'
function getColor(i, total, b = 10) {
  let l = isDark.value ? 40 : 85
  return lchToHsl(i, total, 1, b, l - b)
}

</script>

<template lang="pug">
.lines(v-if="list")
  a.line(
    v-for="(line,l) in list", 
    :key="line.title",
    :style="{ backgroundColor: getColor(l, Object.keys(props.list).length) }"
    :href="line.link",
    ) {{ line.title }}
    counter(:list="theme.pages?.[line?.data?.list]") 
    card-date.flex-1.ml-4(:date="line.lastModified")
    shop-price.ml-2(:product="line?.data?.product", :showButton="false" :color="getColor(l, Object.keys(props.list).length, 40)")
</template>

<style  scoped>
.lines {
  @apply flex flex-wrap mx-2  my-4 w-full;
}

.line {
  @apply m-1 shadow-md flex rounded-2xl font-normal items-center px-4 py-2 transition-all bg-gray-50 dark_bg-gray-800 
  hover_(no-underline shadow-lg);
}
</style>