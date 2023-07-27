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
.-top-1.right-0.text-xs.absolute.bg-light-900.bg-opacity-90.text-center.rounded-full.text-black.w-5.h-5.dark-bg-dark-300.dark-text-white.dark-bg-opacity-60.backdrop-blur-md
	.p-0 {{quantity || '+'}}
</template>