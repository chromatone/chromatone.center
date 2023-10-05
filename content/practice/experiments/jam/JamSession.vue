<script setup>
import JamScale from './JamScale.vue'
import JamChroma from './JamChroma.vue'
import JamTime from './JamTime.vue'
import JamDate from './JamDate.vue'
import JamNow from './JamNow.vue'
import { globalScale } from '#/use'
</script>

<template lang="pug">
#screen.bg-light-900.dark-bg-dark-800
	.flex.gap-6.p-4.justify-between.relative.items-stretch.flex-col(
	:style="{backgroundColor:`hsla(${30*globalScale.tonic}, 80%, 50%, 0.1)`}"
	)

		//- .flex.w-full
			rhythm-circle(style="flex: 1 0 50%")
			midi-monitor(style="flex: 1 1 25%")
		jam-time
		jam-date
		//- jam-now
		jam-scale
		jam-chroma.flex-auto

		.flex.p-4.gap-4.items-center.flex-wrap.w-full
			chroma-keys.m-4(
				style="flex: 1 1 200px"
				:chroma="globalScale.chroma" 
				:pitch="globalScale.tonic")
			chord-tabs-neck(style="flex: 4 1 300px" instrument="guitar")
		state-transport

		//- midi-roll.-z-10.absolute.bottom-2.w-full
</template>