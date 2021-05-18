<template lang='pug'>
nav.nav-links(v-if="show")
  template(v-if="links")
    .item(v-for="item in links", :key="item.text")
      nav-dropdown-link(v-if="item.items", :item="item")
      nav-link(v-else, :item="item").

  .item(v-if="localeLinks")
    nav-dropdown-link(:item="localeLinks").

  .item(v-if="repo")
    nav-link(:item="repo").
      
      
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSiteDataByRoute } from 'vitepress'
import { useLocaleLinks } from '../../composables/nav'
import { useRepo } from '../../composables/repo'

const site = useSiteDataByRoute()
const localeLinks = useLocaleLinks()
const repo = useRepo()

const show = computed(() => links.value || repo.value)

const links = computed(() => site.value.themeConfig.nav)
</script>

<style scoped>
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

  .item + .item {
    padding-left: 24px;
  }
}
</style>
