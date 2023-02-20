import { useStorage } from "@vueuse/core";
import { reactive } from 'vue'

export const state = reactive({
	colorize: useStorage('colorize-notes', false)
})