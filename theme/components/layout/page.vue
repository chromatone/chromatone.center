<script setup>
import { computed } from 'vue';
import { isDark } from '#/theme/composables/state'
import { useRoute, useData } from 'vitepress'
import { data } from '../../../content/pages.data.js'
import { cleanLink, usePages, usePage } from 'vitepress-pages'
import { lchToHsl } from '#/use/colors'

const route = useRoute()
const { siblings, parents, children } = usePages(route, data)
const page = usePage(route, data)

const { frontmatter } = useData()

const pageColor = computed(() => {
  let l = isDark.value ? 40 : 60
  return lchToHsl(siblings.value.index, siblings.value.total, 1, 20, l)
});

const lightColor = computed(() => lchToHsl(siblings.value.index, siblings.value.total, 1, 70, 60));
</script>

<template lang="pug">
main#content

  page-headline(:pageColor="pageColor", :lightColor="lightColor" :page="page")
    page-parents.text-xl.mb-4(:parents="parents.slice(0,-1)")

  transition(name="fade")
    .content-container(:key="route.path")
      row-list.my-2.max-w-full(v-if="!frontmatter.value?.topContent" :children="children")

      content.content.flex-auto.z-10

      shop-message(:page="page", :siblings="siblings")

      row-list.my-2.max-w-full(v-if="frontmatter.value?.topContent" :children="children")

  nav-next-prev(:siblings="siblings" :parents="parents")
  page-footer
</template>

<style lang="postcss" scoped>
main {
  flex: 1 1 70%;
  @apply flex flex-col;
  justify-content: stretch;
}

.content-container {
  @apply flex flex-col p-0 sm-p-4 flex-1 items-stretch bg-light-400 dark-bg-dark-400;
}
</style>
