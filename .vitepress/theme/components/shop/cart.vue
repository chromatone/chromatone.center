<script setup>
import { cart, checkout, total, open } from '#/theme/composables/cart'



</script>

<template lang='pug'>
.flex.flex-col(v-if="Object.keys(cart).length > 0")
	table.text-left
		tr
			td Position
			td Price
			td Quantity
			td Total
		tr(v-for="(pos,id) in cart" :key="id")
			td.font-bold.flex-1.text-left {{pos.title}}
			td ${{pos.price}}
			td
				.flex.justify-between.items-center

					.flex.gap-2.items-center
						button.text-sm.cursor-pointer.bg-light-900.bg-opacity-20.p-1.rounded-xl(@click="pos.quantity--")
							la-minus
						.font-bold {{pos.quantity}}
						button.text-sm.cursor-pointer.bg-light-900.bg-opacity-20.p-1.rounded-xl(@click="pos.quantity++")
							la-plus

			td.w-6ch.text-right ${{Number(pos.price) * Number(pos.quantity)}}
		tr
			td.font-bold Delivery
			td.text-right(colspan="3") ${{total}}


	button.shop-button.text-md(@click="checkout()") Checkout
</template>