<script setup>
import ScalePanel from './scale.vue'
import ChromaPanel from './chroma.vue'
import TimePanel from './time.vue'
import DatePanel from './date.vue'
</script>

<template lang='pug'>
#screen.flex.flex-col.gap-4.bg-light-900.dark-bg-dark-800.p-4.justify-between.relative
	time-panel
		full-screen
	date-panel
	//- state-transport
	beat-bars-bar(:editable="true")
	chroma-panel.flex-auto
	scale-panel

</template>