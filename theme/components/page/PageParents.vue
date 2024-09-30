<script setup>
import { cleanLink } from '../../../theme/pages'
const props = defineProps({
  parents: { type: Array }
})


</script>

<template lang="pug">
.w-full.max-w-60ch.flex.flex-wrap.items-stretch.justify-start.gap-2
  a.text-xl.transition.rounded-lg.no-underline.flex.items-center.p-3.bg-light-300.bg-opacity-70.dark-bg-dark-100.dark-bg-opacity-70.hover-bg-light-100.hover-dark-bg-dark-100.opacity-60.hover-opacity-85(
    v-for="page in parents", 

    :key="page.url" 
    :href="cleanLink(page.url)") 
    span.font-normal {{ page?.frontmatter?.title }}
</template>