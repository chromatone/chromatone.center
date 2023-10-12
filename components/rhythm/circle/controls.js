import { useStorage } from "@vueuse/core";
import { reactive, } from 'vue'

export const loops = useStorage('tempo-circle-loops', [
	{
		over: 8,
		under: 8,
		volume: 1,
		sound: 'A'
	},
	{
		over: 3,
		under: 3,
		volume: 0.5,
		sound: 'B'
	}]
);

export function changeLoop(l, n, val) {
	if (val >= 1 && val <= 48) {
		loops.value[l][n] = val
	}
}


export const controls = reactive({
	channel: 1,
	tempoCC: 8,
	cc: [
		{
			over: 1,
			under: 2,
			steps: 3,
			rotate: 4,
			sound: 5,
			pan: 6,
			vol: 7,
		},
		{
			over: 9,
			under: 10,
			steps: 11,
			rotate: 12,
			sound: 13,
			pan: 14,
			vol: 15,
		},
	],
	params: {
		over: 'Number of steps',
		under: 'Subdivision',
		steps: 'Number of active steps',
		rotate: 'Rotation of the pattern',
		sound: 'Beat sound kit',
		pan: 'Panning',
		vol: 'Volume',
		bpm: 'BPM'
	}
})
