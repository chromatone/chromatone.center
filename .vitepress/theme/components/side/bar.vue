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
  transform: translateX(100%);
  transition: all 0.15s ease-out;
  height: calc(100vh - var(--header-height));
  @apply fixed top-$header-height bottom-0 right-0;
}

@screen lg {
  .sidebar {
    display: none;
    transform: translateX(0);
  }
}

.sidebar.open {
  display: block;
  transform: translateX(0);
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
