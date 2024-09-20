<script setup>
import { computed } from 'vue';
import { globalScale, playNoteOnce } from '#/use/chroma';
import ChromaCodeCell from './ChromaCodeCell.vue';

const props = defineProps({
	chroma: { type: String, default: "101101011010" },
	pitch: { type: Number, default: null },
	cols: { type: Number, default: 4 },
});

const emit = defineEmits(['update:chroma']);

const tonic = computed(() => props.pitch ?? globalScale.tonic);

const rows = computed(() => {
	const chromaArray = props.chroma.split('').map(Number);
	return Array.from({ length: Math.ceil(12 / props.cols) }, (_, i) =>
		chromaArray.slice(i * props.cols, (i + 1) * props.cols)
	);
});

const toggleNote = (index) => {
	playNoteOnce(index + tonic.value + 57)
	const newChroma = props.chroma.slice(0, index) +
		(props.chroma[index] === '1' ? '0' : '1') +
		props.chroma.slice(index + 1);
	emit('update:chroma', newChroma);
};
</script>

<template lang="pug">
.flex.flex-col.gap-1.bg-dark-200.bg-opacity-30.dark-bg-light-900.dark-bg-opacity-40.p-2.rounded-lg
	.flex.gap-1(v-for="(row, rowIndex) in rows" :key="rowIndex")
		ChromaCodeCell(
			v-for="(isActive, colIndex) in row"
			:key="colIndex"
			:index="rowIndex * cols + colIndex"
			:tonic="tonic"
			:isActive="isActive === 1"
			@toggle="toggleNote"
		)
</template>