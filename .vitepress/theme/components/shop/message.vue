<script setup>
import { useSiblings } from '../../composables/links.js'
const { current, total } = useSiblings();

</script>

<template lang="pug">
card-box.p-4.mt-2.mb-12.flex.flex-col.max-w-65ch.mx-auto.text-center(
  v-if="$frontmatter.product"
  :i="current"
  :total="total"
  v-slot="{ color }"
  )
  .py-2.pr-4.flex-1 We deliver orders via international post. <br> For <strong>$10</strong> we send registered mail worldwide.<br> And provide the code to track the letter's <strong>1-4 week</strong> journey. 
  .flex.mx-auto(v-if="$frontmatter?.product")
    shop-price(:product="$frontmatter?.product" :color="color")
</template>

<style scoped>
</style>