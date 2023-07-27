<script setup>
import { cart, open, total } from '#/theme/composables/cart'

import { useRouter } from 'vitepress';

const router = useRouter()





</script>

<template lang="pug">
button.text-2xl(@click="Object.keys(cart).length > 0 ? open = !open : router.go('/shop/')" )
	.relative
		.i-la-shopping-cart.hover-opacity-100.transition(:class="{'opacity-50':!Object.keys(cart).length > 0}")
		shop-cart-icon(v-if="Object.keys(cart).length > 0")
transition(name="fade")
	.fixed.bg-dark-100.p-8.top-0.bottom-0.left-0.right-0.bg-opacity-80.backdrop-blur-md(v-if="open && Object.keys(cart).length > 0" @click="open=false")
transition(name="slide")
	.fixed.bottom-2.right-2.left-2.z-2000.bg-light-100.rounded-xl.p-2.shadow-xl.dark-bg-dark-200.dark-border-1.dark-border-light-200.dark-border-opacity-20.max-w-60ch.mx-auto(v-if="open && Object.keys(cart).length > 0" ref="target")
		button.absolute.top-0.right-0.p-4(@click="open = false")
			.i-la-times
		shop-cart
</template>