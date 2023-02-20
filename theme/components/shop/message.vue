<script setup>
import { useSiblings, usePage, pages } from '#/theme/composables/pages'
import { useRoute } from 'vitepress'
import { cart, checkout } from '#/theme/composables/cart'

const route = useRoute()
const { index, total } = useSiblings(route.path);
const page = usePage(route.path)

</script>

<template lang="pug">
card-box.px-4.py-3.ml-4.sm-mx-auto.mr-16.mb-16.flex.flex-col.max-w-65ch.gap-2.bg_light-100.bg-light-200.dark-bg-dark-200.my-8.opacity-80.hover-opacity-100.transition(
  v-if="page?.product"
  :i="index"
  :total="total"
  v-slot="{ color }"
  )
  .text-md.font-bold {{page?.title}}
  //- .text-sm.mb-2 {{page?.description}}
  .flex(v-if="page?.product")
    shop-price.flex-1(
      :product="page?.product" 
      :color="color" 
      :title="page?.title" 
      )
</template>

<style lang="postcss" scoped>

</style>