<script setup>
import { cart, checkout } from '#/theme/composables/cart'
import { lchToHsl, levelColor } from '#/use';

const props = defineProps(['page', 'siblings'])

</script>

<template lang="pug">
.p-4.ml-10.mr-16.flex.flex-col.gap-2.bg_light-100.bg-light-200.dark-bg-dark-200.bg-opacity-85.dark-bg-opacity-85.hover-opacity-100.transition.right-16.sticky.bottom-8.z-10.max-w-57ch.rounded-lg.backdrop-blur-md.shadow-lg(
  v-if="page?.frontmatter?.product"
  :i="siblings.index"
  :total="siblings.total"
  )
  .text-lg.font-bold {{page?.frontmatter?.title}}
  //- .text-sm.mb-2 {{page?.description}}
  .flex(v-if="page?.frontmatter?.product")
    shop-price.flex-1(
      :product="page?.frontmatter?.product" 
      :color="lchToHsl(siblings.index, siblings.total, 1, 40, 60)"
      :title="page?.frontmatter?.title" 
      )
</template>

<style lang="postcss" scoped></style>