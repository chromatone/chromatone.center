<template lang="pug">
.flex.w-full.flex-wrap.items-center
  .flex-1
  a.button.price(v-if="product", :href="product?.link", target="_blank") {{ product?.price }}

  a.button.order.flex.items-center(v-if="product?.link",:href="product?.link", target="_blank")
    mdi-shopping-outline
    span(v-if="showButton").mx-2 Order now 
.text-3xl


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
.button {
  @apply p-2 my-2 mr-2 shadow-md z-6 text-2xl font-bold rounded-lg bg-yellow-400  dark:(bg-yellow-800);
}

.price {
  @apply tracking-widest;
}

.order {
}
</style>