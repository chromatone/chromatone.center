import { RemovableRef, useStorage } from "@vueuse/core";

export const loops = useStorage('tempo-bar-loops-object', {
	0: {
		over: 8,
		under: 8,
		volume: 1,
		sound: 'A'
	},
	1: {
		over: 3,
		under: 3,
		volume: 0.5,
		sound: 'B'
	}
});