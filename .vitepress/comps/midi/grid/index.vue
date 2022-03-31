<script setup>
import { Midi } from '@tonejs/midi'
import { pitchColor } from '@use/calculations'
import { now, PolySynth, Synth, Transport } from 'tone'
import { createAndDownloadBlobFile } from '@use/midiRender'

let midiData

const info = reactive({
  title: '',
  author: '',
  header: '',
  duration: 0,
  tracks: [],
  filteredTracks: computed(() => info.tracks.filter((track, t) => !map.hiddenTracks[t]))
})

const map = reactive({
  width: computed(() => info.duration * 2),
  height: computed(() => map.upper - map.lower),
  upper: computed(() => {
    return 127
  }),
  lower: 0,
  playing: false,
  hiddenTracks: [],
})

function uploaded(ev) {
  let file1 = ev.target.files[0]
  let reader = new FileReader()
  reader.onload = (loaded) => {
    midiData = new Midi(loaded.target.result)
    parse(midiData)
  }
  reader.readAsArrayBuffer(file1)
}

async function parse(data) {
  info.title = data.tracks[0].name
  info.header = data.header
  info.duration = data.duration
  info.ticks = data.durationTicks
  info.tracks = data.toJSON().tracks
}

function clear() {
  info.title = ''
  info.header = ''
  info.duration = 0
  info.tracks = []
  info.ticks = 0
}

function download() {
  createAndDownloadBlobFile(midiData.toArray(), 'chromatone')
}

const synths = []
function play() {
  map.playing = !map.playing
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




</script>

<template lang="pug">
.flex.flex-col.items-center
  .flex.flex-wrap
    button
      label(for="upload")
        la-upload
      input#upload.p-2.w-18em.cursor-pointer(@change="uploaded" type="file" accept="audio/midi")
    button(@click="play()")
      la-play(v-if="!map.playing")
      la-stop(v-else)
    button(@click="clear()")
      la-trash-alt
    button(@click="download")
      la-download
  .flex.flex-wrap
    .p-1(v-for="(track, t) in info.tracks" :key="track") 
      .track(
        @click="map.hiddenTracks[t] = !map.hiddenTracks[t]"
        :class="{ active: !map.hiddenTracks[t] }"
        ) {{ track.channel }}: {{ track.name }} {{ track.instrument.family }}
  .flex.flex-col
    midi-grid-track(
      v-for="(track, t) in info.filteredTracks" :key="track" 
      :track="track"
      )
</template>

<style scoped>
button {
  @apply p-4 m-2 border-1 rounded cursor-pointer;
}
.track {
  @apply bg-light-900 border-1 p-1 dark_bg-dark-100 select-none cursor-pointer rounded;
}
.active {
  @apply bg-light-100 border-current dark_bg-dark-900;
}
</style>

