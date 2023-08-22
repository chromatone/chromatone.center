<script setup>
import { lchToHsl } from '#/use/colors'
import { isDark } from '#/theme/composables/state'

const props = defineProps({
  list: Object,
});

import { useRoute } from 'vitepress'
import { data } from '../../../content/pages.data'
import { cleanLink, usePages, usePage } from 'vitepress-pages'

const route = useRoute();
const { pages } = usePages(route, data)

function getColor(i, total, b = 10) {
  let l = isDark.value ? 40 : 85
  return lchToHsl(i, total, 1, b, l - b)
}

</script>

<template lang="pug">
.lines(v-if="list")
  a.line.no-underline.border-l-6(
    v-for="(line, l) in list", 
    :key="line.url",
    :style="{ borderColor: getColor(l, Object.keys(list).length) }"
    :href="line.url",
    ) {{ line?.frontmatter?.title }}
    counter(:list="pages[cleanLink(line.url)]") 
    card-date.flex-1.ml-4(:date="line.lastModified")
    shop-price.ml-2(
      v-if="line?.frontmatter?.product"
      :title="line?.frontmatter?.title"
      :product="line?.frontmatter?.product", 
      :showButton="false" 
      :color="getColor(l, Object.keys(list).length, 40)"
      )
</template>

<style lang="postcss" scoped>
.lines {
  @apply flex flex-wrap mx-2 my-4 w-full;
}

.line {
  @apply m-1 shadow-md flex flex-wrap gap-4 rounded-md font-normal items-center px-4 py-2 transition-all bg-gray-50 dark-bg-gray-800 hover-(no-underline shadow-lg);
}
</style>