<template lang="pug">
.flex.flex-col.items-center
  .text-2xl MIDI Recorder
  .flex.flex-wrap
    button(@click="play()")
      la-play(v-if="!map.playing")
      la-stop(v-else)
    button
      la-circle
    button(@click="clear()")
      la-trash-alt
    button
      label(for="upload")
        la-upload
      input#upload.p-2.w-18em.cursor-pointer(@change="uploaded" type="file" accept="audio/midi")
    button(@click="download")
      la-download
  .flex.flex-wrap
    .p-1(v-for="(track,t) in info.tracks" :key="track") 
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
    g(v-for="(track,t) in info.filteredTracks" :key="track")
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
import { now, PolySynth, Synth, Transport } from 'tone'

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
  width: computed(() => info.duration),
  height: computed(() => map.upper - map.lower),
  upper: 127,
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

async function parse(parsed) {
  info.title = parsed.tracks[0].name
  info.header = parsed.header
  info.duration = parsed.duration
  info.ticks = parsed.durationTicks
  info.tracks = parsed.toJSON().tracks
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

function createAndDownloadBlobFile(body, filename, extension = 'mid') {
  const blob = new Blob([body]);
  const fileName = `${filename}.${extension}`;
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, fileName);
  } else {
    const link = document.createElement('a');
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}


</script>

<style scoped>
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

