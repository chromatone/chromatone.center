<script setup>
import { noteColor } from '#/use/colors'
import { globalScale } from '#/use/chroma'

const props = defineProps({
	chroma: {
		type: String,
		default: "101101011010"
	}
})

const minor = "101101011010"

function calcBg(i, bit, hover) {
	if (bit == 1) {
		return noteColor((i + globalScale?.tonic) % 12, 3)
	} else if (minor[(i + globalScale?.tonic) % 12] == '1') {
		return 'hsla(0,0%,80%,0.3)'
	} else {
		return 'hsla(0,0%,20%,0.3)'
	}
}
</script>

<template lang='pug'>
.grid.grid-cols-4.gap-1.bg-dark-200.bg-opacity-10.p-1.rounded-lg
	.p-6px.rounded(
		v-for="(active,i) in chroma"
		:key="i"
		:style="{backgroundColor: calcBg(i,active) }")
</template>

<style lang="postcss" scoped>

</style>