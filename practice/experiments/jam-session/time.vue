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
	.flex.uppercase.tabular-nums.font-mono.flex-wrap.gap-1.items-center
		.p-1.flex.gap-2(v-for="d in date" :key="d")  
			.p-0 {{ d }}
		.p-1 POS {{ transport[0] }}:{{ transport[1] }}
		.p-1.min-w-32 TICK {{ tempo.ticks }}
		.flex-auto
		.p-1.flex.gap-2.items-center.border-1.rounded.cursor-pointer.border-opacity-60.border-light-500
			la-slash(@click="tempo.bpm = tempo.bpm/2")
			la-minus(@click="tempo.bpm--")
			.p-0 {{ tempo.bpm }}
			la-plus(@click="tempo.bpm++")
			la-times(@click="tempo.bpm = tempo.bpm*2")
		.pt-4px.pb-5px.px-2.flex.gap-1.items-center.border-1.rounded.border-opacity-60.border-light-500.mr-2
			button(@click="tempo.stopped = true")
				la-stop(:style="{transform:`rotate(${tempo.progress*90}deg)`}")
			button(
				@click="tempo.playing = !tempo.playing"
				)
				la-play(v-if="!tempo.playing")
				la-pause(v-else)

		slot
</template>