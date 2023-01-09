<script setup>
import { cart, open, total } from '#/theme/composables/cart'
import { onClickOutside } from '@vueuse/core'

const target = ref()

onClickOutside(target, () => { open.value = false })

</script>

<template lang='pug'>
button.-mr-1.fixed.bottom-44.right-24px.text-2xl.z-1000(@click="open = !open" v-if="Object.keys(cart).length > 0")
	shop-cart-icon
transition(name="slide")
	.fixed.bottom-2.right-2.left-2.z-2000.bg-light-100.rounded-xl.p-2.shadow-xl.dark-bg-dark-200.dark-border-1.dark-border-light-200.dark-border-opacity-20.max-w-65ch.mx-auto(v-if="open && Object.keys(cart).length > 0" ref="target")
		button.absolute.top-3.right-2(@click="open = false")
			.i-la-times
		shop-cart
</template>