<script setup>
import { midi } from '#/use/midi';
import { controls } from './controls';
</script>

<template lang='pug'>
.flex
	table

		tr
			th Parameter 
			th.text-center(colspan="2") CC
		tr
			th CH {{midi?.cc?.channel}} CC {{midi?.cc?.number}}
			th Outer loop 
			th Inner loop

		tr(v-for="(cc,control) in controls.cc[0]" :key="control")
			td {{controls.params[control]}}
			td(v-for="(n,i) in 2" :key="i")
				input.dark_bg-light-100.dark_bg-opacity-10.p-2.rounded(
					type="number" 
					v-model="controls.cc[i][control]" 
					min="0" max="127"
					:style="{outline: midi?.cc?.number == controls.cc[i][control] ? '1px red solid' : ''}"
					)
		tr
			td BPM
			td(colspan="2")
				input.dark_bg-light-100.dark_bg-opacity-10.p-2.rounded(
					type="number" 
					v-model="controls.tempoCC" 
					min="0" max="127"
					:style="{outline: midi?.cc?.number == controls.tempoCC ? '1px red solid' : ''}"
					)
</template>