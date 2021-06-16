<template lang="pug">
a.nav-bar-title(:href="withBase(localePath)", :aria-label="`${site.title}, назад в начало`")
  img.mr-3.align-bottom.h-30px(v-if="theme.logo", :src="withBase(theme.logo)", alt="Logo")
  .title {{ site.title }}

</template>

<script setup>
import { withBase, useData } from 'vitepress'
const { theme, site, localePath } = useData();
</script>

<style scoped lang="postcss">
.nav-bar-title {
  @apply text-xl md:text-1.3rem font-semibold text-$c-text
    inline-flex items-center whitespace-nowrap
    hover:no-underline;
}

.title {
  @apply xs:block hidden;
}
</style>
