<script setup>
import JamScale from './JamScale.vue'
import JamChroma from './JamChroma.vue'
import JamTime from './JamTime.vue'
import JamDate from './JamDate.vue'
</script>

<template lang="pug">
#screen.flex.gap-4.bg-light-900.dark-bg-dark-800.p-4.justify-between.relative.items-start.flex-wrap
	//- jam-chroma.flex-auto
	//- jam-scale
	.flex.w-full
		rhythm-circle(style="flex: 1 0 50%")
		midi-monitor(style="flex: 1 1 25%")
	//- jam-time
	//- jam-date
	state-transport


</template>