<script setup>
import { useNow, useDateFormat, useStorage } from '@vueuse/core'
import { useDrag } from '@vueuse/gesture';
import { useClamp } from '@vueuse/math';
import { computed, ref } from 'vue';

const now = useNow()
const start = ref(useStorage('jam-start', Date.now() - 1000 * 60 * 60), 0, now)
const finish = useClamp(useStorage('jam-finish', Date.now() + 1000 * 60 * 60), now, Date.now() + 1000 * 60 * 60 * 365)

const elapsed = computed(() => now.value - start.value)
const left = computed(() => finish.value - now.value)
const ratio = computed(() => elapsed.value / (elapsed.value + left.value))

const elapsedDuration = computed(() => getDuration(elapsed.value))
const leftDuration = computed(() => getDuration(left.value))

const mask = ref('HH:mm')

const startTime = useDateFormat(start, mask)
const finishTime = useDateFormat(finish, mask)
const nowTime = useDateFormat(now, 'HH:mm:ss')


const startPad = ref()
const finishPad = ref()

useDrag(({ delta, shiftKey }) => {
	const v = delta[0] - delta[1]
	const c = shiftKey ? 10_0000 : 10_000
	finish.value += v * c
}, { domTarget: finishPad })

useDrag(({ delta, shiftKey }) => {
	const v = delta[0] - delta[1]
	const c = shiftKey ? 10_0000 : 10_000
	start.value += v * c
}, { domTarget: startPad })

function getDuration(time) {
	const s = Math.floor(time / 1000)
	const m = Math.floor(s / 60)
	const h = Math.floor(m / 60)
	const d = Math.floor(h / 24)
	if (d > 0) return `${d}d ${h - d * 24}hr`
	if (h > 0) return `${h}hr ${m - h * 60}min`
	if (m > 0) return `${m}min ${s - m * 60}s`

	return `${s}s`
}

</script>

<template lang="pug">
.flex.flex-col
	svg.w-full(
		viewBox="0 0 1000 100"
		)
		g
			rect(
				stroke="currentColor"
				x="0" 
				y="0" 
				fill="transparent"
				width="1000" 
				height="100")
		g.start
			rect.cursor-move(
				ref="startPad"
				width="150" 
				height="100"
				fill="#6663")
			text.pointer-events-none(
				font-weight="bold"
				x="10"
				y="25"
				fill="currentColor"
				) {{ startTime }}
			rect(
				:width="1000*(ratio)"
				:x="0"
				height="30"
				y="70"
				fill="#9996"
			)
			text.pointer-events-none(
				text-anchor="start"
				x="10"
				y="90"
				fill="currentColor"
				) {{ elapsedDuration }} elapsed
		g.finish
			rect.cursor-move(
				ref="finishPad"
				x="850" 
				:width="150" 
				height="100"
				fill="#9993")
			text.pointer-events-none(
				text-anchor="end"
				font-weight="bold"
				x="990"
				y="25"
				fill="currentColor"
				) {{ finishTime }}
			rect(
				:width="1000*(1-ratio)"
				:x="1000-1000*(1-ratio)"
				height="30"
				y="70"
				fill="#9996"
			)
			text.pointer-events-none(
				text-anchor="end"
				x="990"
				y="90"
				fill="currentColor"
				) {{ leftDuration }} left
		g.now.pointer-events-none
			rect( 
				:width="ratio*1000" 
				height="100"
				fill="#2224")
			g(
				:style="{transform: `translate(${ratio*1000}px)`}")
				line(	
					:y2="100"
					stroke="currentColor"
					stroke-width="4"
					)
				text(
					:text-anchor="left<elapsed ? 'end' : 'start'"
					font-weight="bold"
					:x="left<elapsed ? -10 : 10"
					y="55"
					font-size="24"
					fill="currentColor"
					) {{ nowTime }}
</template>