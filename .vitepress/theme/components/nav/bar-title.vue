<script setup>
import { useData } from 'vitepress'
const { theme, site, localePath } = useData();

defineEmits(['toggle'])
</script>

<template lang="pug">
.nav-bar-title 
  img.cursor-pointer.mr-3.align-bottom.h-30px.lg_pointer-events-none(v-if="theme.icon", :src="theme.icon", alt="Logo" @click="$emit('toggle')")
  a.title(href="/", :aria-label="`${site.title}, назад в начало`") {{ site.title }}

</template>

<style scoped >
.nav-bar-title {
  @apply text-xl md_text-1.3rem font-semibold text-$c-text
    inline-flex items-center whitespace-nowrap
    hover_no-underline;
}

.title {
  @apply xs_block hidden;
}
</style>
