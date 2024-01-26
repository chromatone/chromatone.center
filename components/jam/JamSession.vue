<script setup>
import { ref } from 'vue'

import { globalScale } from '#/use'
import { intervals } from '#/use/theory';

const progression = ref([])
const choosing = ref(false)

</script>

<template lang="pug">
#screen.bg-light-900.dark-bg-dark-800
	.flex.gap-6.p-4.justify-between.relative.items-stretch.flex-col(
	:style="{backgroundColor:`hsla(${30*globalScale.tonic}, 80%, 50%, 0.1)`}"
	)

		//- .flex.w-full
			rhythm-circle(style="flex: 1 0 50%")
			midi-monitor(style="flex: 1 1 25%")
		//- jam-time
		//- jam-date
		//- jam-now
		//- jam-scale
		//- jam-chroma.flex-auto

		.flex.gap-4.items-center.flex-wrap.w-full
			control-scale(style="flex: 1 1 30%")
			chord-tabs-neck(style="flex: 4 1 300px" instrument="guitar")
		//- state-transport
		.flex.flex-wrap.items-center.border-1.rounded-xl.p-4.gap-4
			.p-0.relative.flex.flex-col.gap-4(
				style="flex: 1 1 100px"
				v-for="(chord,c) in progression" :key="chord"

				)

				.flex.items-center.z-20.absolute.bottom-2.left-2.text-xl {{ intervals[chord.degree] }}
				button.flex.items-center.z-20.absolute.bottom-2.right-2.text-xl(
					@click="progression.splice(c,1)"
					)
					.i-la-times
				chroma-keys.max-h-30(
					:chroma="chord.chroma"
					:pitch="(globalScale.tonic+chord.degree)%12"
					)
				chord-tab.max-h-60(
					:chroma="chord.chroma" 
					:pitch="(globalScale.tonic+chord.degree)%12"
					instrument="guitar")
		chord-scales(@chord="progression.push($event); choosing=false" v-show="choosing || progression.length == 0")
		button.text-button.flex-1.cursor-pointer.font-bold.text-xl(v-show="!choosing" @click="choosing = true") ADD CHORDS
		//- midi-roll.-z-10.absolute.bottom-2.w-full
		jam-date
</template>