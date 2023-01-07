<script setup>
import { useTempo } from '#/use/tempo';
import { useNow, useDateFormat } from '@vueuse/core'

const tempo = useTempo()

const now = useNow()

const date = reactive({
	year: useDateFormat(now, 'YYYY'),
	month: useDateFormat(now, 'MMMM'),
	day: useDateFormat(now, 'DD'),
	weekDay: useDateFormat(now, 'ddd'),
	hr: useDateFormat(now, 'HH'),
	min: useDateFormat(now, 'mm'),
	sec: useDateFormat(now, 'ss'),
})

const transport = computed(() => {
	if (!tempo.position) return 0
	return tempo?.position?.split(':').splice(0, 2)
})

const hr = 1000 * 60 * 60
</script>

<template lang='pug'>
.flex.flex-col 
	.flex.uppercase.tabular-nums.font-mono.flex-wrap
		.p-2.flex.gap-2(v-for="d in date" :key="d")  
			.p-0 {{ d }}
		.p-2 POS {{ transport[0] }}:{{ transport[1] }}
		.p-2.min-w-32 TICK {{ tempo.ticks }}
		.flex-auto
		.p-2.flex.gap-1.items-center

			la-divide(@click="tempo.bpm = tempo.bpm/2")
			la-minus(@click="tempo.bpm--")
			.p-0 {{ tempo.bpm }}
			la-plus(@click="tempo.bpm++")
			la-asterisk(@click="tempo.bpm = tempo.bpm*2")
		button.mr-2(
			@click="tempo.playing = !tempo.playing"
			)
			la-play(v-if="!tempo.playing")
			la-pause(v-else)
		button.mr-4(@click="tempo.stopped = true")
			la-stop(:style="{transform:`rotate(${tempo.progress*90}deg)`}")
		slot
</template>