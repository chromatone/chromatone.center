import { useStorage } from "@vueuse/core";
import { Ref } from "vue";

export const loops: Ref = useStorage('tempo-bar-loops', [
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
	}]);