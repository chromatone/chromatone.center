<template lang="pug">
.price(v-if="product") {{ product?.price }}


</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  product: Object,
});
</script>

<style scoped>
.price {
  @apply absolute -right-2 shadow-sm z-6 text-2xl font-bold rounded bg-yellow-600 text-white p-1 my-2 tracking-widest;
}
</style>