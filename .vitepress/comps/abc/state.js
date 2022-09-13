import { useStorage } from "@vueuse/core";

export const state = reactive({
	colorize: useStorage('colorize-notes', false)
})