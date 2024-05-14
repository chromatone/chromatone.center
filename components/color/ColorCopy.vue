<script setup>
import { useClipboard } from '@vueuse/core'
import { computed } from 'vue';
const props = defineProps({
	text: String
})

const source = computed(() => props.text)
const { copy, copied } = useClipboard({ source })


</script>

<template lang="pug">
tspan.font-mono.cursor-pointer(
	@mousedown="copy()" 
	:class="{active: copied}"
	) {{ text }} {{ copied ? 'copied!' : '' }}
</template>