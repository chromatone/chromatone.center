<script setup >
const props = defineProps(['item'])
import { useRoute } from 'vitepress';
import { cleanLink } from 'vitepress-pages'

const route = useRoute()

</script>

<template lang="pug">
.nav-link
  a.item(
    :aria-current="route.path.includes(cleanLink(item.url)) ? 'page' : false"
    :href="cleanLink(item.url)") {{ item?.frontmatter?.title }}
</template>

<style scoped lang="postcss">
.item {
  border-bottom-color: transparent;
  text-decoration: none;
  @apply dark-text-light-800 hover-dark-text-light-100 mx-1 flex justify-center font-bold block border-0 px-3 py-1.5 w-full text-left font-$font-family-base font-semibold text-$c-text whitespace-nowrap bg-transparent cursor-pointer lg-(border-b-2px px-0 text-0.9rem);
}

.item:hover,
.item.active,
.item[aria-current="page"] {
  text-decoration: none;
  color: var(--c-brand);
  /* border-bottom-color: var(--c-brand); */
}

.item.external:hover {
  border-bottom-color: transparent;
  color: var(--c-text);
}

@screen lg {

  .item:hover,
  .item.active {
    /* border-bottom-color: var(--c-brand); */
    color: var(--c-text);
  }
}
</style>
