<template lang="pug">
transition(name="fade")
  main(:key="route.path")
    page-header
    .content-container
      content.content
      shop-message
      row-list.mb-32
    page-next-prev

    .flex.flex-col.items-justify.p-4(
      class="bg-light-900 dark:bg-dark-700"
    )
      .flex.flex-wrap.justify-stretch
        a.p-8.flex.items-center.justify-center.m-2.rounded-xl.shadow-lg.transition-all.duration-300.ease-out(
          style="flex:1 1"
          class="hover:bg-light-100/50 dark:(hover:bg-dark-100/50)"
          v-for="parent in parents" :key="parent"
          :href="parent.link"
          )
          carbon-chevron-left.mr-1
          .p-1 {{ parent.title }}
      a.text-xl.p-4.flex.flex-col.items-center(href="/")
        img.w-16(:src="theme.logo")
        .p-2 Chromatone
    //- footer-row
</template>

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { useParents } from '../../composables/links.js'

const route = useRoute()
const { theme } = useData()

const parents = useParents();

</script>

<style  scoped>
main {
  flex: 1 1 70%;
  @apply flex flex-col;
}
.content-container {
  @apply flex flex-col rounded-xl items-stretch bg-light-600 dark:(bg-dark-600);
}
</style>
