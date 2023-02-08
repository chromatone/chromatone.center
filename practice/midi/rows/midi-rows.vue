<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useMidi, useSequence, useTempo, pitchColor } from '../../../.vitepress/use/';
import { Transport, Part } from 'tone'
import { Midi } from '@tonejs/midi'

const midiFile = new Midi()
midiFile.name = 'Chromatone recording'
const track = midiFile.addTrack()
track.addNote({
	ticks: 100,
	midi: 60,
	duration: 1
})

const { midi } = useMidi()

const { seq } = useSequence(null, 1, 'row')
const tempo = useTempo()

const row = reactive({
	width: 100,
	height: 30,
	progress: computed(() => row.width * seq.progress),
	recording: false
})

const totalTicks = computed(() => (seq.meter.over * Transport.PPQ * 4 / seq.meter.under))

const circularTicks = computed(() => tempo.ticks % totalTicks.value)

const part = new Part(note => {
	console.log(note)
})


watch(() => midi.note, note => {
	if (!row.recording) return
	track.addNote({
		midi: note.number,
		ticks: circularTicks.value
	})
	console.log(track.notes)
})

function startRecording() {
	console.log('recording started')
}
</script>

<template lang='pug'>
.flex.flex-col 
	.text-2xl MIDI ROWS {{ circularTicks }} 
	.flex.flex-wrap 
		button(@click="row.recording = !row.recording")
			.i-la-circle
		button(@click="tempo.playing = !tempo.playing")
			.i-la-play(v-if="!tempo.playing")
			.i-la-pause(v-else)
		button(@click="seq.meter.over++")
			.i-la-plus
		.p-1 {{ seq.meter.over }}
		button(@click="seq.meter.over--")
			.i-la-minus
		.p-1 /
		button(@click="seq.meter.under++")
			.i-la-plus
		.p-1 {{ seq.meter.under }}
		button(@click="seq.meter.under--")
			.i-la-minus
	.flex.flex-col 
		svg(
			:viewBox="`0 0 ${row.width} ${row.height}`"
			)
			rect(
				:width="row.width"
				:height="row.height"
				fill="#999"
			)
			g.channel(v-for="channel in midi?.channels" :key="channel")
				//- g.note(
					v-for="(note, num,i) in channel?.notes" :key="note"
					opacity="0.1"
					:transform="`translate(${0} ${i * row.height/Object.keys(channel.notes).length})`"
					)
					text(font-size="1.5" :y="2" x="2")  {{ num }} {{ note.pitch }}
					rect(
						:x="0"
						:y="0"
						:width="row.width"
						:height="row.height/Object.keys(channel.notes).length"
						:fill="pitchColor(note?.pitch)"
					)

			line(
				:x1="row.progress"
				:x2="row.progress"
				:y1="0"
				:y2="row.height"
				stroke="black"
				)
			g(
				v-for="step in seq.steps" :key="step"
				:transform="`translate(${row.width*step[0].split('-')[0]/seq.steps.length})`"
				)
				line(
					:y2="row.height"
					stroke="black"
					stroke-width="0.1"
					)
				text(y="3" x="1" font-size="2") {{ Number(step[0].split('-')[0])+1 }}
	.grid.grid-cols-3.text-xs.gap-2 
		pre {{ seq }}
		pre {{ tempo }}
		pre 
			p {{ midi.note }}
			p {{ midi.clock }}
</template>