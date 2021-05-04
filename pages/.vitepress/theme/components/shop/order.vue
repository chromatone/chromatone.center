<template lang="pug">
a.price(v-if="product",:href="product?.link || '/contact/'") Order
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  product: Object,
});
</script>

<style  scoped>
.price {
  @apply text-xl text-white font-bold rounded-full bg-yellow-600 px-4 py-2 self-start;
}
</style>