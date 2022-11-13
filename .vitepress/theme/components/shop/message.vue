<script setup>
import { useSiblings, usePage, pages } from '#/theme/composables/pages'
import { useRoute } from 'vitepress'
import { cart, checkout } from '#/theme/composables/cart'

const route = useRoute()
const { index, total } = useSiblings(route.path);
const page = usePage(route.path)

</script>

<template lang="pug">
card-box.p-4.mx-4.mb-16.flex.flex-col.max-w-65ch.gap-4(
  v-if="page?.product"
  :i="index"
  :total="total"
  v-slot="{ color }"
  )
  .py-2.pr-4.flex-1 We deliver orders via international post. <br> For <strong>$10</strong> we send registered mail worldwide.<br> And provide the code to track the letter's <strong>1-4 week</strong> journey. 
  .flex(v-if="page?.product")
    shop-price.flex-1(
      :product="page?.product" 
      :color="color" 
      :title="page?.title" 
      )
  //- shop-cart
</template>

<style lang="postcss" scoped>

</style>