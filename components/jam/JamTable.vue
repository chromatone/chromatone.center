<script setup>
import { globalScale } from '#/use'
</script>

<template lang="pug">
#screen.bg-light-900.dark-bg-dark-800
	.flex.gap-6.p-4.justify-between.relative.items-stretch.flex-col.min-h-full(
	:style="{backgroundColor:`hsla(${30*globalScale.tonic}, 80%, 50%, 0.1)`}"
	)

		//- .flex.w-full
			rhythm-circle(style="flex: 1 0 50%")
			midi-monitor(style="flex: 1 1 25%")
		//- jam-time
		//- jam-date
		//- jam-now
		.flex.p-4.gap-4.items-center.flex-wrap.w-full
			gpu-shader.w-60.h-60
			chroma-keys.flex-1.max-h-60.transform.-scale-y-100.-scale-x-100(
				:chroma="globalScale.chroma"
				:pitch="globalScale.tonic"
				)


		jam-date
		jam-scale
		jam-chroma.flex-auto

		.flex.p-4.gap-4.items-center.w-full
			jam-time
			chroma-keys.flex-1.max-h-60(
				:chroma="globalScale.chroma"
				:pitch="globalScale.tonic"
				)
			chroma-flower.w-60.op-70(
				:letters="false"
				:chroma="true"
			)
		//- state-transport

		//- midi-roll.-z-10.absolute.bottom-2.w-full
</template>