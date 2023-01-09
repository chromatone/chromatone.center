<script setup>
import { cart } from '#/theme/composables/cart'
import { computed } from 'vue';

const props = defineProps({
	id: { type: String, default: null }
})

const quantity = computed(() => {
	let q = 0
	if (props.id) {
		q = cart.value?.[props.id]?.quantity
	} else {
		for (let id in cart.value) {
			q += cart.value[id].quantity
		}
	}
	return q
})
</script>

<template lang="pug">
.relative
	.i-la-shopping-cart
	.-top-1.right-0.text-xs.absolute.bg-purple-600.bg-opacity-90.px-1.rounded-full.text-white {{quantity}}
</template>