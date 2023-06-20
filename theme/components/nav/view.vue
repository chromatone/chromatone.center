<script setup>
import { drawingEnabled, drawingPinned } from '../draw/draw'
</script>

<template lang='pug'>
.z-4000.fixed.right-6.bottom-6.flex.flex-col.items-center.gap-6
	shop-cart-panel
	full-screen.text-xl.opacity-30.hover-opacity-100.transition
	button.text-xl.opacity-30.hover-opacity-100.transition(
		@click="drawingEnabled = !drawingEnabled"
		:class="{ active: drawingEnabled }"
		v-tooltip.top="'Draw on the screen'"
		)
		.i-carbon-pen
	state-dark.opacity-30.hover-opacity-100.transition
	nav-scroll.opacity-30.hover-opacity-100.transition
</template>