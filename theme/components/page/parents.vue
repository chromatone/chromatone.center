<script setup>
const props = defineProps(['parents'])
</script>

<template lang="pug">
.-mt-2.inline-flex.flex-wrap.items-stretch.justify-start.gap-2
  a.transition-all.rounded-xl.duration-500.no-underline.text-lg.flex.items-center.p-2.bg-light-300.bg-opacity-70.dark-bg-dark-100.dark-bg-opacity-70.hover-bg-light-100.hover-dark-bg-dark-100.flex-auto(
    v-for="page in parents", 
    :key="page.url" 
    :href="page.url") 
    .i-carbon-chevron-left.mr-1
    span {{ page?.frontmatter?.title }}
</template>
  
<style></style>