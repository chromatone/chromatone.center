<script setup>
const props = defineProps({
  product: Object,
  showButton: {
    type: Boolean,
    default: true,
  },
  color: { type: String, default: '#444' }
});
</script>

<template lang="pug">
.shop-action 
  a.button.price(
    v-if="product",
    :href="product?.link", 
    target="_blank",
    :style="{ backgroundColor: color }"

  ) {{ product?.price }}

  a.button.flex.items-center(
    v-if="product?.link",
    :href="product?.link", 
    target="_blank"
    :style="{ backgroundColor: color }"
    )
    eva-shopping-bag-outline.order
    span.cart-text(v-if="showButton") Buy
</template>



<style scoped>
.shop-action {
  @apply flex justify-center items-center;
}

.button {
  @apply p-2 my-2 mr-2 shadow-md z-6 text-white text-2xl  rounded-md bg-yellow-500  dark:(bg-yellow-600);
}

.price {
  @apply tracking-widest flex-1;
}

.cart-text {
  @apply text-xl ml-2 transition-all duration-300;
}

.order {
  font-size: 1.68rem;
}
</style>