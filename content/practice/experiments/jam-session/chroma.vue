<script setup>
import { globalScale } from '#/use/chroma';
import { calcBg } from '#/use/colors'
import { notes } from '#/use/theory';
</script>

<template lang="pug">
.flex.flex.gap-1
	.flex 
	.p-2.flex-1.text-white.rounded.cursor-pointer(
		v-for="(active,i) in globalScale.chroma"
		:key="i"
		:style="{backgroundColor:calcBg(i,active,'#fff3','#0003'), opacity: active == 1 ? 1 : 0.5}"
		@click="globalScale.tonic = (i+globalScale.tonic)%12"
		) 
		.font-bold.text-center(:style="{fontWeight:active == 1 ? 'bold': 'normal'}") {{ notes[(i+globalScale.tonic)%12] }}
</template>