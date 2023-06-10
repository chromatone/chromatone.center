<script setup >
const props = defineProps(['item'])

</script>

<template lang="pug">
.nav-link
  a.item(:href="item.url") {{ item?.frontmatter?.title }}
</template>

<style scoped lang="postcss">
.item {
  @apply block border-0 px-3 py-1.5 w-full text-left font-$font-family-base font-semibold text-$c-text whitespace-nowrap bg-transparent cursor-pointer lg-(border-b-2px border-transparent px-0 font-normal text-0.9rem);
}

.item:hover,
.item.active {
  text-decoration: none;
  color: var(--c-brand);
}

.item.external:hover {
  border-bottom-color: transparent;
  color: var(--c-text);
}

@screen lg {

  .item:hover,
  .item.active {
    border-bottom-color: var(--c-brand);
    color: var(--c-text);
  }
}
</style>
