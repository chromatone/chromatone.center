<script setup>
import { useData } from "vitepress";
const { theme, site, localePath } = useData();

defineEmits(["toggle"]);
</script>

<template lang="pug">
header.nav-bar.relative
  img.top-4.fixed.z-1000.cursor-pointer.mr-3.h-30px(v-if="theme.icon", :src="theme.icon", alt="Logo" @click="$emit('toggle')")
  .nav-bar-title

    a.title.ml-10.no-underline(href="/", :aria-label="`${site.title}, go to main page`") {{ site.title }}

  div(class="hidden lg_flex px-3 ml-4 lg_ml-10")
    nav-links
  .flex-grow
  client-only
    nav-tools
  //- nav-toggle-sidebar(@toggle="$emit('toggle')")
</template>

<style lang="postcss" scoped>
.nav-bar {
  @apply lg_(sticky top-0) inset-x-0 z-4000 flex select-none border-b-1px border-$c-divider py-0.7rem px-4 z-40 h-$header-height bg-$c-bg md_px-5 lg_px-6;
}

.nav-bar.root {
  @apply border-transparent bg-$c-bg-semi;
}

.nav-bar-title {
  @apply text-xl md_text-1.3rem font-semibold text-$c-text inline-flex items-center whitespace-nowrap hover_no-underline;
}

.title {
  @apply xs_block hidden;
}
</style>
