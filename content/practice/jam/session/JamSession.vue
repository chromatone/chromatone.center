<script setup>
import { ref } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'

import { globalScale } from '#/use'
import { intervals } from '#/use/theory';
import { useStorage } from '@vueuse/core';

const list = ref()
const progression = useStorage('jam-progression', [])
const choosing = ref(false)

const animation = 200
const { option } = useSortable(list, progression)

option('animation', animation)
const instrument = ref('guitar')
</script>

<template lang="pug">
#screen.bg-light-900.dark-bg-dark-800
	.flex.gap-6.p-4.justify-between.relative.items-stretch.flex-wrap(
	:style="{ backgroundColor: `hsla(${30 * globalScale.tonic}, 80%, 50%, 0.1)` }"
		)

		.flex.flex-wrap.items-center.border-1.rounded-xl.p-4.gap-4(ref="list")
			.p-0.relative.flex.flex-col.gap-4(
				style="flex: 1 1 100px"
				v-for="(chord, c) in progression" :key="chord")

				.relative
					chroma-keys.max-h-30(
					:chroma="chord.chroma"
					:playAll="true"
					:pitch="(globalScale.tonic + chord.degree) % 12")
					.flex.items-center.z-20.absolute.bottom-2.left-2.text-xl {{ intervals[chord.degree] }}
					button.flex.items-center.z-20.absolute.bottom-2.right-2.text-xl(
					@click="progression.splice(c, 1)")
						.i-la-trash
				chord-tab.max-h-60(
					:chroma="chord.chroma" 
					:pitch="(globalScale.tonic + chord.degree) % 12"
					:instrument="instrument")

		//- .flex.w-full
			rhythm-circle(style="flex: 1 0 50%")
			midi-monitor(style="flex: 1 1 25%")
		//- jam-time
		//- jam-date
		//- jam-now
		//- jam-scale
		//- jam-chroma.flex-auto

		.flex.gap-4.items-center.flex-col.w-full(style="flex: 1 1 200px")
			control-scale
				select.p-2.m-2.rounded-lg.font-bold.dark-bg-dark-300(v-model="instrument")
					option(value="guitar") Guitar
					option(value="ukulele") Ukulele
			chord-scales.overflow-scroll.z-1000.max-w-80vw(
				@chord="progression.push($event)" )
		.p(style="flex: 1 1 200px")
			chord-tabs-neck(style="flex: 4 1 100px" :instrument)
		//- state-transport

		//- midi-roll.-z-10.absolute.bottom-2.w-full
		jam-date

</template>