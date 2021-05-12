<template lang="pug">
a.price(v-if="product", :href="product?.link", target="_blank") {{ product?.price }}
a.order(v-if="product?.link && showButton",:href="product?.link", target="_blank") Buy now


</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  product: Object,
  showButton: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped>
.price {
  @apply absolute right-2 top-2 shadow-sm z-6 text-2xl font-bold rounded-lg bg-yellow-600 text-white p-2 my-2 tracking-widest
  md:(-right-2);
}

.order {
  @apply block flex-1 text-center text-xl text-white mt-2 font-bold rounded-lg bg-yellow-600 py-3  px-4 self-start transition-all
  md:(absolute -right-2 bottom-8);
}
</style>