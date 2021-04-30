<template lang="pug">
footer
  nav
    .flex.items-center.flex-col(v-for="page in sortList($site.customData.pages?.main)", :key="page.title")
      a.section(:href="page.link", :class="{ active: route.path.includes(page.link) }") {{ page.title }}
      .flex.flex-wrap.justify-center
        a.p-2.font-normal(v-for="line in sortList($site.customData?.pages?.[page.data?.list])", :key="line.title", :href="line.link", :class="{ active: route.path.includes(line.link) }") {{ line.title }}

  .flex.items-center.mt-8
    a.m-auto(href="/")
      .text-2xl.text-center {{ $site.title }}
      img.h-8em.my-4(:src="$themeConfig.logo") 
</template>

<script setup lang="ts">
import { sortList } from '@composables/list.js'
import { useBrowserLocation } from '@vueuse/core'
import { useRoute, useSiteData, inBrowser } from 'vitepress'

const route = useRoute()

</script>

<style scoped lang="postcss">
footer {
  @apply min-h-26vh bg-gray-200 dark:bg-gray-900 flex flex-col pt-16 pb-16 px-4;
}

nav {
  @apply max-w-55ch mx-auto flex flex-col;
}

.section {
  @apply text-xl p-2;
}

a {
  @apply transition-all opacity-60 hover:(opacity-80 no-underline);
}

.active {
  @apply text-$c-brand;
}
</style>
