<script setup>
import { cart, addToCart } from '#/theme/composables/cart'

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
.shop-action.text-xl(
  @click.prevent.stop="addToCart(title, product)"
  )
  .shop-button.price(
    v-if="product",
    :style="{ backgroundColor: color }"

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
    style="flex: 3;"
    v-if="product?.id"
    :style="{ backgroundColor: color }"

    ) 
    shop-cart-icon(:id="product?.id")
    .font-bold.cart-text Add to cart

</template>


<style lang="postcss" scoped>
.shop-action {
  @apply flex justify-center items-center gap-2;
}

.price {
  @apply tracking-widest font-bold tabular-nums;
  flex: 0;
}

.cart-text {
  @apply flex-1 text-xl ml-2 transition-all duration-300;

}

.order {
  font-size: 1.68rem;
}
</style>