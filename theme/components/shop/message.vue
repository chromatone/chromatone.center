<script setup>
import { cart, checkout } from '#/theme/composables/cart'

const props = defineProps(['page', 'siblings'])

</script>

<template lang="pug">
card-box.px-4.py-3.m-8.mr-16.flex.flex-col.gap-2.bg_light-100.bg-light-200.dark-bg-dark-200.opacity-90.hover-opacity-100.transition.right-16.sticky.bottom-8.z-100.max-w-58ch(
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