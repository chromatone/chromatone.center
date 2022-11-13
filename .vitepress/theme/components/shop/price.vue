<script setup>
import { cart, addToCart } from '#/theme/composables/cart.js'

const props = defineProps({
  title: String,
  product: Object,
  showButton: {
    type: Boolean,
    default: true,
  },
  color: { type: String, default: '' }
});


</script>

<template lang="pug">
.shop-action.text-xl
  .shop-button.price(
    v-if="product",
    :style="{ backgroundColor: color }"
    @click="addToCart(title, product)"
  ) ${{ product?.price }}

  //- a.shop-button.flex.items-center(
  //-   v-if="product?.link",
  //-   :href="product?.link", 
  //-   target="_blank"
  //-   :style="{ backgroundColor: color }"
  //-   )
  //-   eva-shopping-bag-outline.order
  //-   span.cart-text(v-if="showButton") Buy
  .shop-button.flex.items-center(
    v-if="product?.id"
    :style="{ backgroundColor: color }"
    @click.prevent.stop="addToCart(title, product)"
    ) 
    shop-cart-icon(:id="product?.id")
    .font-bold.cart-text.whitespace-nowrap Add to cart

</template>


<style lang="postcss" scoped>
.shop-action {
  @apply flex justify-center items-center;
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