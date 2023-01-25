<script setup>
import { midi } from '#/use/midi';
</script>

<template lang='pug'>
.midi-grid 
	.channel(v-for="channel in midi?.channels" :key="channel")
		.note(v-for="(n,i) in 12" :key="i")
			.octave(
				v-for="(o,j) in 9" :key="j"
				)
</template>

<style scoped lang="postcss">
.midi-grid {
	display: grid;
	grid-template-rows: repeat(16, 1fr);
}

.channel {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
}

.octave {
	padding: 1px;
}
</style>