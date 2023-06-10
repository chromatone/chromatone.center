<script setup>
import { computed } from 'vue';
import { useLocaleLinks } from '../../composables/nav'

import { useRoute, useData } from 'vitepress'
import { data } from '../../../content/pages.data.js'
import { cleanLink, usePages, usePage } from 'vitepress-pages'

const route = useRoute();
const { children, pages } = usePages({ path: '/' }, data)


const site = useData()
const localeLinks = useLocaleLinks()


</script>

<template lang="pug">
nav.nav-links
  template(v-if="children")
    .item(v-for="item in children", :key="item.url")
      nav-dropdown-link(v-if="pages[cleanLink(item.url)]", :item="item")
      nav-link(v-else, :item="item").

  .item(v-if="localeLinks")
    nav-dropdown-link(:item="localeLinks")

</template>

<style lang="postcss" scoped>
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
  }

  .item+.item {
    padding-left: 24px;
  }
}
</style>
