<script setup>
import { computed, reactive, watch } from 'vue';
import { useMidi, useSequence, useTempo, pitchColor, synthOnce } from '#/use/index';
import { getTransport, Part, Frequency } from 'tone'
import { Midi } from '@tonejs/midi'

const Transport = getTransport()

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

const part = new Part((time, note) => {
	console.log(note)
	synthOnce(Frequency(note.midi, "midi").toNote(), note.duration + 'i')
}).set({
	loop: true,
	loopEnd: '800i',
	loopStart: 0,
	playbackRate: 1,
	probability: 1
}).start(0)

const activeNotes = reactive({})

const allNotes = reactive([])

const { track, midiFile } = useMidiTracks()

watch(() => midi.note, note => {
	synthOnce(Frequency(note.number, "midi").toNote() + '', '196i')
	if (!row.recording || !tempo.playing) return
	if (note.velocity > 0) {
		activeNotes[note.number] = circularTicks.value
	} else {
		const start = activeNotes?.[note.number]
		const stop = circularTicks.value
		let duration
		if (stop > start) {
			duration = stop - start
		} else {
			duration = totalTicks.value - start + stop
		}
		allNotes.push({
			ticks: circularTicks.value,
			midi: note.number,
			channel: note.channel,
			start,
			stop,
			duration
		})
		part.add({
			time: circularTicks.value + 'i',
			midi: note.number,
			duration
		})
	}
})

function useMidiTracks() {
	const midiFile = new Midi()
	midiFile.name = 'Chromatone recording'
	const track = midiFile.addTrack()
	return {
		midiFile, track
	}
}

</script>

<template lang='pug'>
.flex.flex-col 
	.text-2xl MIDI ROWS {{ circularTicks }}/{{ totalTicks }} 
	.flex.flex-wrap 
		button(@click="row.recording = !row.recording")
			.i-la-circle(v-if="!row.recording")
			.i-mdi-checkbox-blank-circle(v-else)
		button(@click="tempo.playing = !tempo.playing")
			.i-la-play(v-if="!tempo.playing")
			.i-la-pause(v-else)
		button(@click="tempo.stopped = Date.now()")
			.i-la-stop
		button(@click="track.notes = []")
			.i-la-trash-alt
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
				:transform="`translate(${row.width * step[0].split('-')[0] / seq.steps.length})`"
				)
				line(
					:y2="row.height"
					stroke="black"
					stroke-width="0.1"
					)
				text(y="3" x="1" font-size="2") {{ Number(step[0].split('-')[0]) + 1 }}
	.flex.text-xs.p-4 {{ allNotes }}
	.grid.grid-cols-3.text-xs.gap-2 
		pre {{ seq }}
		pre {{ tempo }}
		pre 
			p  {{ track }}
			p {{ midi.clock }}
			p {{ midi.note }}

</template>