<script setup>
import { useParents } from '#theme/composables/pages'
import { useRoute } from 'vitepress'

const route = useRoute()

const parents = computed(() => useParents(route.path))

</script>

<template lang="pug">
.tabs
  a.link(v-for="page in parents", :key="page.path" :href="page.path") 
    carbon-chevron-left.mr-1
    span {{ page?.title }}
</template>
  
<style lang="postcss" scoped>
.tabs {
  @apply -mt-2 inline-flex flex-wrap items-stretch justify-start;
}

.link {
  @apply transition-all rounded-xl mr-1 duration-500 no-underline text-lg flex items-center p-2 bg-light-300/70 dark_(bg-dark-100/70) hover_(bg-light-100 dark_bg-dark-100);
  flex: 0 1 auto;
}
</style>