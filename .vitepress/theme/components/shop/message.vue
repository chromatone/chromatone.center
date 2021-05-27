<template lang="pug">
.p-8.flex.max-w-65ch.m-auto.border-1.rounded-lg(v-if="$frontmatter.product")
  .py-2.pr-4.flex-1 We deliver orders via international post. For $10 we send registered mail worldwide. With a code for you to track the letter's 1-4 weeks trip. 
  shop-price(:product="$frontmatter?.product")
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({

});
</script>

<style scoped>
</style>