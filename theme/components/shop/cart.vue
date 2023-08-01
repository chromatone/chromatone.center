<script setup>
import { cart, checkout, total, open, delivery, count } from '#/theme/composables/cart'
</script>

<template lang="pug">
.flex.flex-col.tabular-nums.gap-1(v-if="cart && Object.keys(cart).length > 0")
	.flex.justify-between
		.text-lg.px-4.pt-1.pb-2 My shopping cart
	.overflow-y-scroll.max-h-60vh.overscroll-contain
		table.text-left.m-0.mb-4.text-sm.md-text-lg.w-full
			tr.text-md.sticky.top-0.z-20
				td Item
				td.text-center Price
				td.text-center Quantity
				td.text-right Total
			tr(v-for="(pos,id) in cart" :key="id")
				td.font-bold.flex-1.text-left.flex.items-center.gap-1 
					a.cursor-pointer.no-underline(:href="pos.path" @click="open = false") {{pos.title}}
					.i-la-file-download.text-sm(
						v-if="pos.digital"
						v-tooltip="'This is a digital good. You will receive a link to download the file and will be able to print it by yourself.'"
						)
				td.text-center ${{pos.price}}
				td
					.flex.justify-between.items-center
						.flex.gap-2.items-center.flex-1.justify-center
							button.cursor-pointer.text-sm.cursor-pointer.bg-light-900.bg-opacity-20.p-1.rounded-xl(@click="pos.quantity--")
								.i-la-minus
							.font-bold {{pos.quantity}}
							button.cursor-pointer.text-sm.cursor-pointer.bg-light-900.bg-opacity-20.p-1.rounded-xl(@click="pos.quantity++")
								.i-la-plus
				td.w-6ch.text-right.font-bold ${{Number(pos.price) * Number(pos.quantity)}}
			tr(v-if="delivery.needed")
				td.font-bold 
					.flex.gap-2 
						p Worldwide delivery
				td(colspan="2")
					.flex.flex-col.gap-2
						.flex-1(v-for="(way,name) in delivery.ways" :key="way")
							label.w-full.px-2.pt-1.pb-2.border-1.rounded-lg.flex.flex-wrap.items-center.border-dark-100.border-opacity-40.transition.cursor-pointer.gap-1.relative(
								:class="{active:delivery.current == name}"
								)
								input.hidden(
									type="radio" 
									name="delivery" 
									v-model="delivery.current"
									:value="name")
								.price.text-lg ${{way.price}}&nbsp;
								.font-normal.text-left {{way.title}}
								.i-la-info-circle.absolute.top-2.right-2(v-tooltip.top="{content:way.desc, distance:8, delay:200, triggers:['hover']}")
				td.text-right.font-bold ${{delivery?.selected?.price}}
			tr(:style="{opacity: count > 1 ? 1: .3}" v-if="delivery.needed")
				td(colspan="1")
					.flex.gap-4
						.text-md <b>Free</b> Holographic Chromatone sticker for <b>2 or more</b> items!
				td FREE
				td.text-center.font-bold {{ count >=2 ? 1 : 0 }}
				td.relative
					.flex.items-center.justify-center
						.i-la-plus.absolute.-left-1.text-1rem(v-if="count>1")
						img.h-8(src="/media/logo/holologo.svg")
			tr.sticky.bottom-0
				td.font-bold(colspan="2") Total
				td.font-bold.text-center {{ count + (delivery.needed && count>=2 ? 1 : 0) }} items
				td.font-bold.text-right ${{total}}

.flex.gap-2.mt-2
	button.font-bold.shop-button.text-md.flex-1(@click="checkout()") CHECKOUT &nbsp;
		span ${{total}}
.my-2.text-xs.opacity-40.text-center Safe payment processing service provided by <a href="https://stripe.com" target="_blank">Stripe</a>.  <br> Please <a href="mailto:support@chromatone.center">contact us</a> in case of any problems with checkout.

</template>

<style scoped lang="postcss">
tr {
	@apply backdrop-blur-sm
}

tr:nth-child(2n) {
	@apply dark-bg-dark-300/80 bg-light-100/80;
}

tr:nth-child(2n+1) {
	@apply dark-bg-dark-400/80 bg-light-800/80;
}

.active {
	@apply border-dark-700 dark-border-light-100 dark-bg-dark-400 bg-light-700;
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