<template lang="pug">
aside
  slot
  .sidebar(:class="{ open }")
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
  overflow-y: auto;
  transition: all 0.15s ease-out;
  height: calc(100vh - var(--header-height));
  @apply fixed top-$header-height bottom-0 left-0 transform -translate-x-full lg:(static h-full translate-x-0) shadow-xl bg-light-600 dark:bg-dark-700;
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
