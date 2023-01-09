<script setup>
import { useCopy } from '#/use/clipboard.js'

const props = defineProps({
	text: String
})

const { copied, copyTextToClipboard } = useCopy(props.text)
</script>

<template lang="pug">
tspan.font-mono(

	@mousedown="copyTextToClipboard(text)" 
	:class="{active: copied}"
	) {{ text }} {{ copied ? 'copied!' : '' }}
</template>