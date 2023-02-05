<script setup>
import { Midi } from '@tonejs/midi'
import { noteColor } from "#/use/colors"
import { now, PolySynth, Synth } from 'tone'
import { midi } from '#/use/midi'
import { useAudio } from '#/use/audio'
import { computed, reactive, watch } from 'vue'

new Midi()

const info = reactive({
  title: '',
  author: '',
  header: '',
  duration: computed(() => info.latest - info.started),
  tracks: {},
  first: 0,
  last: 1000,
  top: 61,
  bottom: 60,
})

const map = reactive({
  width: 1000,
  height: 500,
  playing: false,
  recording: false,
  hiddenTracks: [],
})

watch(() => midi.note, note => {
  if (!map.recording) return
  if (!info.tracks[note.channel]) {
    info.tracks[note.channel] = {
      active: {},
      notes: [],
    }
  }
  if (info.first == 0) {
    info.first = note.timestamp
  }
  if (note.number >= info.top) info.top = note.number
  if (note.number <= info.bottom) info.bottom = note.number
  if (note.type == 'noteon') {
    info.tracks[note.channel].active[note.number] = note

  } else {
    info.last = note.timestamp
    let start = info.tracks?.[note.channel].active?.[note.number]?.timestamp
    note.duration = note.timestamp - start
    delete info.tracks[note.channel].active[note.number]
    info.tracks[note.channel].notes.push(note)
  }
})

function calcX(time) {
  let fromStart = time - info.first
  let fullLength = (info.last - info.first) || 1
  let x = (fromStart / fullLength) * map.width
  return x
}

function calcY(number) {
  let over = info.top - number
  let under = number - info.bottom - 1
  let h = (over / (under + over)) * map.height
  return h
}


const synths = []
function play() {
  map.playing = !map.playing
  const { master } = useAudio()
  if (map.playing) {
    const noww = now() + 0.5
    info.filteredTracks.forEach(track => {
      //create a synth for each track
      const synth = new PolySynth(Synth, {
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      }).connect(master.limiter)
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


</script>

<template lang="pug">
.flex.flex-col.items-center
  .text-2xl MIDI Recorder
  .flex.flex-wrap
    button(@click="play()")
      .i-la-play(v-if="!map.playing")
      .i-la-stop(v-else)
    button(@click="map.recording = !map.recording")
      .i-la-circle(:style="{ color: map.recording ? 'red' : '' }")
    button(@click="clear()")
      .i-la-trash-alt
    button(@click="download")
      .i-la-download
  // .flex.flex-wrap
  // input(type="text" v-model="info.title" placeholder="Title")
  svg.h-30em.w-full(version="1.1" baseProfile="full" :viewBox="`0 0 ${map.width} ${map.height}`" xmlns="http://www.w3.org/2000/svg")
    g(v-for="(track) in info.tracks" :key="track")
      rect(v-for="note in track.notes" :key="note" rx="0.4" :x="calcX(note.timestamp)" :y="calcY(note.number)" :width="note.duration * 1000 / (info.last - info.first)" :height="map.height / (info.top - info.bottom)" :fill="noteColor((note.number + 3) % 12)")
  // .flex.flex-wrap
  // .p-1 {{ info.top }} - {{ info.bottom }}
</template>

<style lang="postcss" scoped>
button {
  @apply p-4 m-2 border-1 rounded cursor-pointer;
}

.track {
  @apply bg-light-900 border-1 p-1;
}

.active {
  @apply bg-light-100 border-current;
}
</style>

