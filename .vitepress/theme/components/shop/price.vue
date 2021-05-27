<template lang="pug">
.flex.justify-center.items-center
  a.button.price(v-if="product", :href="product?.link", target="_blank") {{ product?.price }}

  a.button.flex.items-center(v-if="product?.link",:href="product?.link", target="_blank")
    eva-shopping-bag-outline.order
    span.cart-text(v-if="showButton") Buy now
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
  @apply p-2 my-2 mr-2 shadow-md z-6 text-white text-2xl  rounded-lg bg-yellow-500  dark:(bg-yellow-600);
}

.price {
  @apply tracking-widest flex-1;
}

.cart-text {
  @apply hidden sm:(block) text-xl ml-2;
}

.order {
  font-size: 1.68rem;
}
</style>