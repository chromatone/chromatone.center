<script setup>
import { cart, checkout } from '#/theme/composables/cart'

import { useRoute } from 'vitepress'
import { data } from '../../../content/pages.data.js'
import { cleanLink, useSiblings, usePage } from 'vitepress-pages'

const route = useRoute()
const siblings = useSiblings(route, data)
const page = usePage(route, data)

</script>

<template lang="pug">
card-box.px-4.py-3.ml-4.sm-mx-auto.mr-16.mb-16.flex.flex-col.max-w-65ch.gap-2.bg_light-100.bg-light-200.dark-bg-dark-200.my-8.opacity-80.hover-opacity-100.transition(
  v-if="page?.frontmatter?.product"
  :i="siblings.index"
  :total="siblings.total"
  v-slot="{ color }"
  )
  .text-md.font-bold {{page?.frontmatter?.title}}
  //- .text-sm.mb-2 {{page?.description}}
  .flex(v-if="page?.frontmatter?.product")
    shop-price.flex-1(
      :product="page?.frontmatter?.product" 
      :color="color" 
      :title="page?.frontmatter?.title" 
      )
</template>

<style lang="postcss" scoped></style>