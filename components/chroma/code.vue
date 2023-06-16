<script setup>
import { noteColor, calcBg } from '#/use/colors'
import { globalScale } from '#/use/chroma'
import { computed } from 'vue';
import { intervals, notes } from '#/use/theory';

const props = defineProps({
	chroma: {
		type: String,
		default: "101101011010"
	},
	pitch: {
		type: Number,
		default: null
	},
	cols: {
		type: Number,
		default: 4
	},
})

const tonic = computed(() => props.pitch != null ? props.pitch : globalScale.tonic)

const rows = computed(() => props.chroma.match(new RegExp(`.{1,${props.cols}}`, 'g')).map(el => el.split('').map(Number)))

const minor = "101101011010"

const emit = defineEmits(['update:chroma'])

const toggleChar = (str, pos) => str.slice(0, pos) + (str[pos] === '1' ? '0' : '1') + str.slice(pos + 1);


</script>

<template lang="pug">
.flex.flex-col-reverse.gap-1.bg-dark-200.bg-opacity-30.dark-bg-light-900.dark-bg-opacity-40.p-1.rounded-lg
	.flex.gap-1(v-for="(row,r) in rows" :key="row")
		.w-6.h-6.flex.flex-col.items-center.justify-center.rounded.text-xs.font-bold.select-none.cursor-pointer(
			@click="$emit('update:chroma',toggleChar(chroma,(r*cols+col) % 12))"
			v-tooltip="`${notes[(tonic+r*4+col) % 12]}`"
			v-for="(active,col) in row" :key="col"
			:style="{backgroundColor: active ? noteColor(tonic+r*cols+col) : minor.split('')[(tonic+r*cols+col) % 12] == '1' ? 'hsla(0,0%,100%,0.5)' :  'hsla(0,0%,10%,0.5)',opacity:`${active == 1 ? 1 : 0.4}` }") {{ intervals[(r*4+col) % 12] }}
</template>

<style lang="postcss" scoped></style>