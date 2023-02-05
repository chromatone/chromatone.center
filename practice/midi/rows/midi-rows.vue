<script setup>
import { watch } from 'vue';
import { useMidi } from '../../../.vitepress/use/midi';

const { midi } = useMidi()

watch(() => midi.note, note => {
	console.log(note)
})

function startRecording() {
	console.log('recording started')
}
</script>

<template lang='pug'>
.flex.flex-col 
	.text-2xl MIDI ROWS
	.flex.flex-wrap 
		button(@click="startRecording()")
			.i-la-circle
	.flex.flex-col.gap-2 

</template>