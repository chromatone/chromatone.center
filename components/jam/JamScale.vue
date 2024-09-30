<script setup>
import { guessChords } from '#/use';
import { globalScale } from '#/use/global';
import { noteColor } from '#/use/colors';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { ScaleType } from 'tonal'

const menu = ref()
onClickOutside(menu, () => {
	choose.value = false
})

const choose = ref(false)
</script>

<template lang="pug">
.flex.gap-4.items-center
	.w-full.flex.gap-4.cursor-pointer.bg-dark-900.bg-opacity-40.p-2.rounded-xl.items-center(
		@click="choose = !choose"
		)
		.p-0.text-2xl.font-bold.flex.items-center.gap-4 {{ globalScale?.note?.name }} {{ globalScale?.set?.name }}
		.flex-1
		.text-lg.i-la-angle-down
	.w-60.text-lg.tabular-nums.font-mono {{ guessChords[0] }}
	slot
		//- chroma-code(

			:chroma="globalScale?.chroma"
			:cols="12")  

	//- .flex.items-center.gap-2
		.p-2.w-12.text-center.rounded.font-bold(
			:style="{backgroundColor:noteColor(globalScale?.tonic)}"
			) {{ globalScale?.note?.name }}

	transition(name="fade")
		.flex.flex-col.max-h-40vh.overflow-scroll.absolute.bg-light-100.dark-bg-dark-100.rounded-xl.overscroll-contain.scroll-smooth.snap-y.snap-proximity.z-100(
			v-show="choose" 
			ref="menu")
			.text-md.flex-auto.flex.items-center.gap-2.cursor-pointer.hover-bg-light-400.hover-bg-opacity-10.p-2(
				v-for="scale in ScaleType.all()"
				:key="scale"
				@click="globalScale.chroma = scale.chroma; choose = false"
				)
				.p-0.text-xl {{ scale.name }}
				.flex-1
				chroma-code(
					:chroma="scale.chroma"
					:cols="12"
					)  
				
</template>