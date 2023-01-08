<script setup>

import { lchToHsl } from '#/use/colors.js'
import { isDark } from '#/theme/composables/state'
import { pages } from '#/theme/composables/pages'


const props = defineProps({
  list: Object,
});




function getColor(i, total, b = 10) {
  let l = isDark.value ? 40 : 85
  return lchToHsl(i, total, 1, b, l - b)
}

</script>

<template lang="pug">
.lines(v-if="list")
  a.line.no-underline(
    v-for="(line, l) in list", 
    :key="line.title",
    :style="{ backgroundColor: getColor(l, Object.keys(props.list).length) }"
    :href="line.path",
    ) {{ line.title }}
    counter(:list="pages[line.path]") 
    card-date.flex-1.ml-4(:date="line.lastModified")
    shop-price.ml-2(
      v-if="line?.product"
      :title="line?.title"
      :product="line?.product", 
      :showButton="false" 
      :color="getColor(l, Object.keys(props.list).length, 40)"
      )
</template>

<style lang="postcss" scoped>
.lines {
  @apply flex flex-wrap mx-2 my-4 w-full;
}

.line {
  @apply m-1 shadow-md flex flex-col gap-4 rounded-2xl font-normal items-center px-4 py-2 transition-all bg-gray-50 dark-bg-gray-800 hover-(no-underline shadow-lg);
}
</style>