<script setup>
import { cart } from '#/theme/composables/cart'

const props = defineProps({
	id: { type: String, default: null }
})

const quantity = computed(() => {
	let q = 0
	if (props.id) {
		q = cart?.[props.id]?.quantity
	} else {
		for (let id in cart) {
			q += cart[id].quantity
		}
	}
	return q
})
</script>

<template lang='pug'>
.relative
	la-shopping-cart
	.-top-1.right-0.text-xs.absolute.bg-purple-400.bg-opacity-90.px-1.rounded-full.text-black {{quantity}}
</template>