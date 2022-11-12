<script setup>
import { cart, checkout } from '#/theme/composables/cart'


</script>

<template lang='pug'>
.flex.flex-col
	.flex.flex-col.gap-2
		.p-2.flex.items-center.gap-2(v-for="(pos,id) in cart" :key="id")
			.font-bold.flex-1.text-left {{pos.title}}
			.p-2 ${{pos.price}}
			la-times
			input.dark_bg-dark-100.w-4ch.pb-1.pl-2.rounded(type="number" v-model="pos.quantity")
			la-equals
			.p-2.w-6ch ${{Number(pos.price) * Number(pos.quantity)}}
			button.text-button(@click="delete cart[id]")
				la-trash
	button.text-button(@click="checkout()") Checkout
</template>