<script setup>
import { useData, useRoute } from 'vitepress'
import { data } from '../../../content/pages.data'
import { cleanLink, usePages, usePage } from '../../../pages/index'

const route = useRoute();
const { pages, children } = usePages(route, data)


</script>

<template lang="pug">
.flex.flex-wrap.gap-2.bg-dark-100.bg-opacity-30
  a.text-lg.flex.items-center.no-underline(
    class="hover-no-underline"
    href="/"
    )
    img.w-8(src="/media/logo/click-logo.svg")
    .p-2 Chromatone
  a.link.no-underline.transition-all.duration-300.justify-center(
    v-for="page in pages['/']"
    :key= "page.url"
    :href="cleanLink(page.url)"
    :class="{ active: route.path.includes(cleanLink(page.url)) }"
    )
    .p-0 {{ page?.frontmatter?.title }} 
</template>

<style lang="postcss" scoped>
.link {
  @apply rounded-lg flex-auto text-center p-4 bg-light-400 bg-opacity-10 dark-bg-dark-700 dark-bg-opacity-10 hover-bg-light-200 dark-hover-bg-dark-50;
}

.link.active {
  @apply bg-light-100 bg-opacity-70 z-2 dark-bg-dark-200 dark-bg-opacity-70;
}
</style>