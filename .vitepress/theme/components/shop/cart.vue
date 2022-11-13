<script setup>
import { cart, checkout, total, open, delivery } from '#/theme/composables/cart'



</script>

<template lang='pug'>
.flex.flex-col(v-if="Object.keys(cart).length > 0")
	table.text-left.m-0.mb-4
		tr.text-md
			td Position
			td.text-center Price
			td.text-center Quantity
			td.text-right Total
		tr(v-for="(pos,id) in cart" :key="id")
			td.font-bold.flex-1.text-left {{pos.title}}
			td.text-center ${{pos.price}}
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
			td.font-bold(v-tooltip.bottom="'We deliver orders via international post. For $10 we send registered mail worldwide. And provide the code to track its 1-4 week journey. '") 
				.flex.items-center.gap-2 
					p.whitespace-nowrap Worldwide delivery
					.px-2.rounded-xl.bg-light-800 i
			td.text-right(colspan="3") ${{delivery}}
		tr.text-xl
			td.font-bold Total
			td.font-bold.text-right(colspan="3") ${{total}}

	.flex.gap-2
		button.shop-button.text-md.flex-1(@click="checkout()") Checkout
		button.border-2.px-2.rounded-xl(@click="open = false") Close
</template>