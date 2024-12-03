<script setup>
import { Midi } from '@tonejs/midi'
import { noteColor } from "#/use/colors"
import { now, PolySynth, Synth } from 'tone'
import { createAndDownloadBlobFile } from '#/use/render'
import { computed, reactive, ref, shallowRef, watch } from 'vue';

const midiData = shallowRef()

const info = reactive({
  title: '',
  author: '',
  header: '',
  duration: 0,
  tracks: [],
  filteredTracks: computed(() => info.tracks.filter((track, t) => !map.hiddenTracks[t]))
})

const range = computed(() => {
  let upper = 0
  let lower = 127
  info.filteredTracks.forEach(t => {
    t.notes.forEach(n => {
      if (upper < n.midi) upper = n.midi
      if (lower > n.midi) lower = n.midi
    })
  })
  return { lower, upper }
})

const map = reactive({
  width: computed(() => info.duration),
  height: computed(() => range.value.upper - range.value.lower),
  playing: false,
  hiddenTracks: [],
  start: 0,
  end: info.duration
})



function uploaded(ev) {
  let file1 = ev.target.files[0]
  let reader = new FileReader()
  reader.onload = (loaded) => {
    midiData.value = new Midi(loaded.target.result)
    parse(midiData.value)
  }
  reader.readAsArrayBuffer(file1)
}

async function parse(parsed) {
  info.title = parsed.tracks[0].name
  info.header = parsed.header
  map.end = info.duration = parsed.duration
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
  createAndDownloadBlobFile(midiData.value.toArray(), 'chromatone')
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
  .flex.flex-wrap.items-center
    .flex.items-center
      label(for="upload")
        .i-la-upload
      input#upload.p-2.w-18em.cursor-pointer(
        type="file" 
        accept="audio/midi"
        @change="uploaded" )
    button(@click="play()")
      .i-la-play(v-if="!map.playing")
      .i-la-stop(v-else)
    button(@click="clear()")
      .i-la-trash-alt
    //- button(@click="download")
    //- .i-la-download

    control-rotary(
      v-model="map.start"
      :min="0"
      :max="map.end - 1"
      param="Start"
      )
    control-rotary(
      v-model="map.end"
      :min="map.start + 1"
      :max="info.duration"
      param="End"
      )

    save-svg(svg="visual" v-if="info.duration" :file="info?.title") DOWNLOAD SVG
  .flex.w-full
    .flex.flex-col.max-h-60vh.overflow-scroll(style="flex: 1 1 50px")
      .px-1(
        v-for="(track, t) in info.tracks" 
        :key="track") 
        .track(
          :class="{ active: !map.hiddenTracks[t] }"
          @click="map.hiddenTracks[t] = !map.hiddenTracks[t]"
          ) {{ track.channel }}: {{ track.name }} {{ track.instrument.family }}

    .flex-1(style="flex: 10 1 500px")
      svg#visual.max-h-70vh.w-full(
        preserveAspectRatio="none"
        version="1.1",
        baseProfile="full",
        :viewBox="`${map.start} ${127 - range.upper} ${map.end - map.start} ${map.height}`",
        xmlns="http://www.w3.org/2000/svg",
        )
        g(
          v-for="(track) in info.filteredTracks" 
          :key="track")
          rect(
            v-for="note in track.notes"
            :key="note" 
            rx="0.1"
            :x="note.time"
            :y="127 - note.midi"
            :width="note.duration"
            height="1"
            :fill="noteColor((note.midi + 3) % 12)"
            )  
        
</template>

<style lang="postcss" scoped>
button {
  @apply p-4 m-2 border-1 rounded cursor-pointer;
}

.track {
  @apply bg-light-900 border-1 border-dark-400 border-op-10 px-1 dark-bg-dark-100 select-none cursor-pointer rounded dark-border-light-300 dark-border-op-60;
}


.active {
  @apply bg-light-100 border-op-100 dark-border-op-100 dark-bg-dark-900;
}
</style>
