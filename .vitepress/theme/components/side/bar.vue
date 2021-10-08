<template lang="pug">
aside(class="max-w-sm h-auto border-l-1px border-$c-divider")
  slot
  .sidebar(:class="{ open }")
    // nav-links.nav
    side-Links
  
</template>

<script setup>
defineProps({
  open: { type: Boolean, required: true },
});
</script>

<style scoped>
.sidebar {
  z-index: var(--z-index-sidebar);
  width: 16.4rem;
  background-color: var(--c-bg);
  overflow-y: auto;
  transition: all 0.15s ease-out;
  height: calc(100vh - var(--header-height));
  @apply fixed top-$header-height bottom-0 left-0 transform -translate-x-full;
}

.sidebar.open {
  @apply translate-x-0;
}

.nav {
  display: block;
}

@screen lg {
  .nav {
    display: none;
  }
}
</style>
