<script setup>
import { cart, addToCart } from '#/theme/composables/cart'
import { useRoute } from 'vitepress';

const props = defineProps({
  title: String,
  product: Object,
  showButton: {
    type: Boolean,
    default: true,
  },
  color: { type: String, default: '' }
});

const route = useRoute()

</script>

<template lang="pug">
.shop-action.text-xl(
  style="font-weight: normal;"
  v-if="product",
  )
  .price.p-2.text-2xl.bg-light-200.bg-opacity-70.rounded-md.dark-bg-dark-400.dark-bg-opacity-70.backdrop-blur-lg.font-bold(
    :style="{ color: color }"
  ) ${{ product?.price }} {{  }}
  .price.p-2.text-2xl.bg-light-200.bg-opacity-70.rounded-md.dark-bg-dark-400.dark-bg-opacity-70.backdrop-blur-lg.font-bold(v-if="product?.digital" v-tooltip="'This is a digital good. You will receive a link to download the file and will be able to print it by yourself.'")
    .i-la-file-download

  .flex-auto
  .shop-button.flex.items-center(
    style="flex: 0 0 140px;"
    v-if="product?.id"
    :style="{ backgroundColor: color }"
    @click.prevent.stop="addToCart(title, {...product, path:route.path})") 

    shop-cart-icon.scale-120(:id="product?.id")
    .cart-text Add to cart
  //- a.shop-button.flex.items-center(
  //-   v-if="product?.link",
  //-   :href="product?.link", 
  //-   target="_blank"
  //-   :style="{ backgroundColor: color }"
  //-   )
  //-   eva-shopping-bag-outline.order
  //-   span.cart-text(v-if="showButton") Buy
</template>


<style lang="postcss" scoped>
.shop-action {
  @apply flex items-center gap-2 mb-1;
}

.price {
  @apply tracking-widest tabular-nums;
  flex: 0;
}

.cart-text {
  @apply flex-1 text-xl font-bold ml-2 transition-all duration-300;

}

.order {
  font-size: 1.68rem;
}
</style>