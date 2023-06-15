<script setup>
import { cart, checkout } from '#/theme/composables/cart'

const props = defineProps(['page', 'siblings'])

</script>

<template lang="pug">
card-box.px-4.py-3.ml-4.flex.flex-col.max-w-60ch.gap-2.bg_light-100.bg-light-200.dark-bg-dark-200.my-8.opacity-80.hover-opacity-100.transition.right-16.fixed.bottom-8.z-100(
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