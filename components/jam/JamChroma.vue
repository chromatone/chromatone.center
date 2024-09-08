<script setup>
import { midi, pitchColor, activeChromaMidi } from '#/use';
import { globalScale } from '#/use/chroma';
import { calcBg } from '#/use/colors'
import { notes, intervals } from '#/use/theory';
import { useData } from 'vitepress';
import { colord } from 'colord'
const { isDark } = useData()
</script>

<template lang="pug">
.flex.flex.gap-1
	.flex-1.text-black.rounded.cursor-pointer.relative.flex.items-center.flex-col.gap-2.justify-between.overflow-hidden(
		v-for="(active,i) in globalScale.chroma"
		:key="i"
		:style="{color:colord(calcBg(i,active,'#fff','#000')).isDark() ? 'white' : 'black',backgroundColor:calcBg(i,active,'#fffa','#000a'), opacity: activeChromaMidi[(i+globalScale.tonic)%12] ? 1 :active == 1 ? 0.9 : 0.3}"
		@click="globalScale.tonic = (i+globalScale.tonic)%12"
		)
		.pt-2.font-bold.text-center.text-xl(
			:style="{fontWeight:active == 1 ? 'bold': 'normal'}"
			) {{ notes[(i+globalScale.tonic)%12] }}
		.p-2.mx-auto.opacity-0.rounded-full.transition(
			:style="{backgroundColor: 'currentColor'}"
			:class="{'opacity-80':activeChromaMidi[(i+globalScale.tonic)%12]}"
			)
		.text-md.opacity-80  {{ intervals[i] }}
		.p-6px.w-full.opacity-80(
			:style="{backgroundColor:calcBg(i,0,'#fff8','#0008')}"
		)
		
</template>