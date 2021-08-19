<template lang="pug">
card-box.p-4.mt-2.mb-12.flex.max-w-65ch.m-auto(
  v-if="$frontmatter.product"
  :i="current"
  :total="total"
  v-slot="{ color }"
  )
  .py-2.pr-4.flex-1 We deliver orders via international post. <br> For <strong>$10</strong> we send registered mail worldwide.<br> With a code to track the letter's <strong>1-4 weeks</strong> trip. 
  shop-price(:product="$frontmatter?.product" :color="color")
</template>

<script setup>
import { useSiblings } from '../../composables/links.js'
const { current, total } = useSiblings();

</script>

<style scoped>
</style>