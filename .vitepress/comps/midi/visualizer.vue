<template lang="pug">
.flex.flex-col.items-center
  .text-2xl MIDI Visualizer
  .flex.flex-col
    //- .p-1 {{ midi }}
    la-play(@click="play()")
  .flex.flex-wrap
    .p-1(v-for="(track,t) in tracks" :key="track.channel") 
      .track(
        @click="map.hiddenTracks[t] = !map.hiddenTracks[t]"
        :class="{ active: !map.hiddenTracks[t] }"
        ) {{ track.channel }}: {{ track.name }} {{ track.instrument.family }}
  svg(
    version="1.1",
    baseProfile="full",
    :viewBox="`0 0 ${map.width} ${map.height}`",
    xmlns="http://www.w3.org/2000/svg",
  )
    g(v-for="(track,t) in filteredTracks" :key="t")
      rect(
        rx="0.4"
        v-for="note in track.notes" :key="note"
        :x="note.time"
        :y="127 - note.midi"
        :width="note.duration"
        height="1"
        :fill="pitchColor((note.midi + 3) % 12)"
        )    
</template>

<script setup>
import { Midi } from '@tonejs/midi'
import { pitchColor } from 'chromatone-theory'
import { now, PolySynth, Synth } from 'tone'
const midi = reactive({
  tracks: [],
  title: '',
  author: '',
  header: '',
})

const map = reactive({
  width: 100,
  height: 127,
  playing: false,
  hiddenTracks: [],
})

const tracks = ref([])
const filteredTracks = computed(() => tracks.value.filter((track, t) => !map.hiddenTracks[t]))

async function parse() {
  const parsed = await Midi.fromUrl("/midi/examples_bach_846.mid")
  console.log(parsed.toJSON())
  midi.title = parsed.tracks[0].name
  midi.author = parsed.name
  midi.header = parsed.header
  midi.duration = parsed.duration
  map.width = parsed.duration
  midi.ticks = parsed.durationTicks
  tracks.value = parsed.toJSON().tracks
}

const synths = []
function play() {
  map.playing = !map.playing
  if (map.playing) {
    const noww = now() + 0.5
    tracks.value.forEach(track => {
      //create a synth for each track
      const synth = new PolySynth(Synth, {
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      }).toDestination()
      synths.push(synth)
      //schedule all of the events
      track.notes.forEach(note => {
        synth.triggerAttackRelease(note.name, note.duration, note.time + noww, note.velocity)
      })
    })
  } else {
    //dispose the synth and make a new one
    while (synths.length) {
      const synth = synths.shift()
      synth.dispose()
    }
  }
}

parse()

</script>

<style scoped>
.track {
  @apply bg-light-900 border-1 p-1;
}
.active {
  @apply bg-light-100 border-current;
}
</style>

