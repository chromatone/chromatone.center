<script setup>
import { computed } from 'vue';
import { useLocaleLinks } from '../../composables/nav'

import { useRoute, useData } from 'vitepress'
import { data } from '../../../content/pages.data.js'
import { cleanLink, usePages, usePage } from 'vitepress-pages'

const { theme, site, localePath } = useData();
const route = useRoute();
const { children, pages } = usePages({ path: '/' }, data)

const localeLinks = useLocaleLinks()

defineEmits(["toggle"]);
</script>

<template lang="pug">
img.top-16px.left-4.fixed.z-1000.cursor-pointer.mr-3.h-30px(v-if="theme.icon", :src="theme.icon", alt="Chromatone logo" @click="$emit('toggle')")
header.nav-bar.relative(data-tauri-drag-region="true")

  .nav-bar-title
    a.title.ml-10.no-underline(href="/", :aria-label="`${site.title}, go to main page`") {{ site.title }}

  nav.nav-links.hidden.lg-flex.px-3.ml-4.lg-ml-10
    template(v-if="children")
      .item(v-for="item in children", :key="item.url")
        nav-dropdown-link(v-if="pages[cleanLink(item.url)]", :item="item")
        nav-link(v-else, :item="item").

  .item(v-if="localeLinks")
    nav-dropdown-link(:item="localeLinks")
  .flex-grow
  client-only
    nav-tools
  //- nav-toggle-sidebar(@toggle="$emit('toggle')")
</template>

<style lang="postcss" scoped>
.nav-bar {
  @apply inset-x-0 z-500 flex select-none border-b-1px border-$c-divider py-0.7rem px-4 h-$header-height bg-$c-bg md-px-5 lg-px-6;
}

.nav-bar.root {
  @apply border-transparent bg-$c-bg-semi;
}

.nav-bar-title {
  @apply text-xl font-semibold text-$c-text inline-flex items-center whitespace-nowrap hover-no-underline;
}

.nav-links {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--c-divider);
}

@screen lg {
  .nav-links {
    display: flex;
    padding: 2px 0 0;
    align-items: center;
    border-bottom: 0;
    gap: 0.7em;
  }
}
</style>
