<script setup>
import { globalScale } from '#/use/chroma';
import { noteColor } from '#/use/colors';
import { scaleList } from '#/use/theory';
import { onClickOutside } from '@vueuse/core';

const menu = ref()
onClickOutside(menu, () => {
	choose.value = false
})

const choose = ref(false)
</script>

<template lang='pug'>
.flex-col.gap-2.flex
	.flex.gap-2.cursor-pointer(
		@click="choose = !choose"
		)
		chroma-code(
			:chroma="globalScale?.chroma"
			:cols="12")  
		.p-0 {{ globalScale?.note?.name }} {{ globalScale?.set?.name }}
	transition(name="fade")
		.flex.flex-col.max-h-8em.overflow-scroll.absolute.bottom-4.bg-light-100.dark_bg-dark-100.rounded-xl.overscroll-contain.scroll-smooth.snap-y.snap-proximity(v-if="choose" ref="menu")
			.text-md.flex-auto.flex.gap-2.cursor-pointer.hover_bg-light-400.hover_bg-opacity-10.p-2(
				v-for="scale in scaleList"
				:key="scale"
				@click="globalScale.chroma = scale.chroma; choose = false"
				) 
				chroma-code(
					:chroma="scale.chroma"
					:cols="12"
					)  
				.p-0 {{ scale.name }}
</template>