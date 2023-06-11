<script setup>
import { noteColor, calcBg } from '#/use/colors'
import { globalScale } from '#/use/chroma'

const props = defineProps({
	chroma: {
		type: String,
		default: "101101011010"
	},
	cols: {
		default: 4,
		type: Number
	}
})

</script>

<template lang="pug">
.grid.gap-1.bg-dark-200.bg-opacity-10.p-1.rounded-lg(
	:style="{gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`}"
	)
	.p-2.rounded(
		v-for="(active,i) in chroma"
		:key="i"
		:style="{backgroundColor: calcBg(i,active), transform:`scale(${active == 1 ? 1 : 0.5})` }")
</template>

<style lang="postcss" scoped></style>