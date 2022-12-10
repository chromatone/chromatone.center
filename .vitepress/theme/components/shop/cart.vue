<script setup>
import { cart, checkout, total, open, delivery } from '#/theme/composables/cart'
</script>

<template lang='pug'>
.flex.flex-col.overflow-scroll.max-h-85vh.tabular-nums.gap-1(v-if="cart && Object.keys(cart).length > 0")
	.flex.justify-between
		.text-lg.px-4.pt-1 My shopping cart
	table.text-left.m-0.mb-4.text-sm.md_text-lg
		tr.text-md
			td Item
			td.text-center Price
			td.text-center Quantity
			td.text-right Total
		tr(v-for="(pos,id) in cart" :key="id")
			td.font-bold.flex-1.text-left {{pos.title}}
			td.text-center ${{pos.price}}
			td
				.flex.justify-between.items-center
					.flex.gap-2.items-center.flex-1.justify-center
						button.text-sm.cursor-pointer.bg-light-900.bg-opacity-20.p-1.rounded-xl(@click="pos.quantity--")
							la-minus
						.font-bold {{pos.quantity}}
						button.text-sm.cursor-pointer.bg-light-900.bg-opacity-20.p-1.rounded-xl(@click="pos.quantity++")
							la-plus
			td.w-6ch.text-right.font-bold ${{Number(pos.price) * Number(pos.quantity)}}
		tr.text-center
			td.font-bold 
				.flex.items-center.gap-2 
					p.whitespace-nowrap Worldwide delivery
			td(v-for="(way,name) in delivery.ways" :key="way")
				label.w-full.px-2.pt-1.pb-2.border-1.rounded-lg.flex.flex-wrap.items-center.border-dark-100.border-opacity-40.transition.cursor-pointer(
					:class="{active:delivery.current == name}"
					v-tooltip.top="{content:way.desc, distance:8, delay:400, triggers:['hover','click','focus','touch']}"
					)
					input.hidden(
						type="radio" 
						name="delivery" 
						v-model="delivery.current"
						:value="name")
					.price.text-lg ${{way.price}}&nbsp;
					.font-normal.text-left {{way.title}}
			td.text-right ${{delivery?.selected?.price}}
		tr.text-xl
			td.font-bold Total
			td.font-bold.text-right(colspan="3") ${{total}}

.flex.gap-2.mt-2
	button.shop-button.text-md.flex-1(@click="checkout()") Checkout 
		span.font-bold ${{total}}

</template>

<style scoped lang="postcss">
tr:nth-child(2n) {
	@apply bg-light-100/10;
}

.active {
	@apply border-dark-700 dark_border-light-100 dark_bg-dark-400 bg-light-700;
}

.active .price {
	@apply font-bold;
}
</style>

<style>
.v-popper__popper {
	max-width: 20em;
}
</style>