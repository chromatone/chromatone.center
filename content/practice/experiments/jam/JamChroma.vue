<script setup>
import { midi, pitchColor } from '#/use';
import { globalScale } from '#/use/chroma';
import { calcBg } from '#/use/colors'
import { notes, intervals } from '#/use/theory';
import { useData } from 'vitepress';
const { isDark } = useData()
</script>

<template lang="pug">
.flex.flex.gap-1
	.p-2.flex-1.text-white.rounded.cursor-pointer.relative.flex.items-center.flex-col.gap-2.justify-between(
		v-for="(active,i) in globalScale.chroma"
		:key="i"
		:style="{backgroundColor:calcBg(i,active,'#fff3','#0003'), opacity: midi.activeChromaMidi[(i+globalScale.tonic)%12] ? 1 :active == 1 ? 0.8 : 0.4}"
		@click="globalScale.tonic = (i+globalScale.tonic)%12"
		)

		.font-bold.text-center.text-xl(:style="{fontWeight:active == 1 ? 'bold': 'normal'}") {{ notes[(i+globalScale.tonic)%12] }}
		.p-1.m-2.mx-auto.opacity-0.rounded-full.transition(
			:style="{backgroundColor: isDark? 'white':'black'}"
			:class="{'opacity-80':midi.activeChromaMidi[(i+globalScale.tonic)%12]}"
			)
		.text-md.opacity-80  {{ intervals[i] }}

		
</template>