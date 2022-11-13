<script setup>
import { cart, open, total } from '#/theme/composables/cart'
import { onClickOutside } from '@vueuse/core'

const target = ref()

onClickOutside(target, () => { open.value = false })

</script>

<template lang='pug'>
button.-mr-1.fixed.bottom-44.right-24px.text-xl.z-1000(@click="open = !open" v-if="Object.keys(cart).length > 0")
	shop-cart-icon
.fixed.top-18.right-2.max-w-70vw.z-1000.bg-light-100.rounded-xl.p-2.shadow-xl.dark_bg-dark-200(v-if="open && Object.keys(cart).length > 0" ref="target")
	//- button.absolute.top-2.right-2(@click="open = false")
	//- 	la-times
	shop-cart
</template>