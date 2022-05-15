<script setup lang="ts">
import { useData } from 'vitepress'
import { useLocaleLinks } from '../../composables/nav.js'
import { pages } from '@theme/composables/pages'


const site = useData()
const localeLinks = useLocaleLinks()


const links = computed(() => pages['/'])
</script>

<template lang="pug">
nav.nav-links
  template(v-if="links")
    .item(v-for="item in links", :key="item.text")
      nav-dropdown-link(v-if="pages[item.path]", :item="item")
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
