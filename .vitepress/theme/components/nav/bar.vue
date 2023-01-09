<script setup>
import { useData } from "vitepress";
const { theme, site, localePath } = useData();

defineEmits(["toggle"]);
</script>

<template lang="pug">
img.top-4.left-4.fixed.z-1000.cursor-pointer.mr-3.h-30px(v-if="theme.icon", :src="theme.icon", alt="Chromatone logo" @click="$emit('toggle')")
header.nav-bar.relative
  .nav-bar-title
    a.title.ml-10.no-underline(href="/", :aria-label="`${site.title}, go to main page`") {{ site.title }}
  div(class="hidden lg-flex px-3 ml-4 lg-ml-10")
    nav-links
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
</style>
