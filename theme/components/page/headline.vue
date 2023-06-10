<script setup>
import { lchToHsl } from '#/use/colors'
import { isDark } from '#/theme/composables/state'
import { computed } from 'vue';

import { useRoute, useData } from 'vitepress'
import { data } from '../../../content/pages.data.js'
import { cleanLink, usePages, usePage } from 'vitepress-pages'

const route = useRoute();
const { siblings, parents } = usePages(route, data)

const page = usePage(route, data)

const pageColor = computed(() => {
  let l = isDark.value ? 40 : 60
  return lchToHsl(siblings.value.index, siblings.value.total, 1, 20, l)
});

const lightColor = computed(() => lchToHsl(siblings.value.index, siblings.value.total, 1, 70, 60));

</script>

<template lang="pug">
.header(
  v-if="!$frontmatter.misc"
  :class="{ 'has-cover': page?.frontmatter?.cover || page?.frontmatter?.icon }"
  :style="{ backgroundColor: pageColor }"
  )
  .cover(v-if="page?.frontmatter?.cover",:style="{ backgroundImage: `url(${page?.frontmatter?.cover})`, backgroundColor: pageColor }")
  img.icon(v-if="page?.frontmatter?.icon",:src="page?.frontmatter?.icon")
  .meta(:style="{ borderColor: pageColor }")
    page-parents.text-xl.mb-4
    .text-4xl.font-bold.mb-4.flex.flex-wrap.items-center(v-if="page?.title" :key="page.url") 
      .mr-2 {{ page?.frontmatter?.title }}
      .flex-1
      .mx-2.my-4.text-6xl(v-if="page?.frontmatter?.emoji") {{ page?.frontmatter?.emoji }}
    .font-bold.mt-2.mb-4(v-if="page?.frontmatter?.description") {{ page?.frontmatter?.description }}
    page-buttons(:buttons="page?.frontmatter?.buttons")
    .absolute.-bottom-2rem.right-2rem
      shop-price(
        :product="page?.frontmatter?.product" 
        :title="page?.frontmatter?.title" 
        :color="lightColor"
        )
</template>

<style lang="postcss" scoped>
.header {
  @apply relative flex min-h-22rem pt-32 px-4 items-center overflow-hidden transition-all duration-400 ease-in;
}

.cover {
  @apply fixed overflow-hidden transition-all ease-in-out duration-500 bg-cover bg-center bg-gray-100 dark-(bg-gray-700) absolute top-0 h-full left-0 right-0;
  filter: saturate(20%) sepia(5%) opacity(10%) blur(0px);
}

@media print {
  .cover {
    @apply h-100px;
  }
}

.header:hover .cover {
  filter: saturate(70%) sepia(0%) opacity(90%) blur(0);
}

.icon {
  @apply m-4 max-h-20em max-w-20em fixed;
}

.meta {
  @apply relative p-8 mb-8 ml-2 bg-light-100 bg-opacity-80 z-3 max-w-65ch w-full mt-8 flex flex-col rounded-3xl shadow-xl dark-(bg-true-gray-800 bg-opacity-80);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
</style>