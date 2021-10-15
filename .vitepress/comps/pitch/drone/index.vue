<template lang="pug">
.max-w-55ch.mx-auto.flex.flex-col.items-stretch.w-full.transition-all.duration-500.ease-out.select-none.rounded-2xl.text-white(

  :style="{ backgroundColor: drone.color }"
)

  .drone.w-full.flex-1.justify-center.flex.flex-col.p-2
    .info.flex.flex-col.items-center.is-group.cursor-pointer.transition-all.duration-500.ease-out(
      style="touch-action:none"
      v-drag="setFreq"

    )
      .notes.w-full.text-sm.font-bold.text-white.text-center.flex.flex-wrap
        .p-2.m-1.flex-1.cursor-pointer.rounded-xl(
          v-for="note in notes" :key="note"
          :style="{ backgroundColor: pitchColor(note.pitch, 4, drone.pitch == note.pitch ? 1 : 0, drone.pitch == note.pitch ? 1 : 0.4) }"
          @click="drone.pitch = note.pitch"
        ) {{ note.name }}
      .flex.flex-wrap.items-center.p-2
        .p-1.text-4xl.font-bold {{ drone.note }} 
        .p-1 {{ drone.centDiff }}
        .p-1 {{ drone.cents }} cents
        .p-1.text-xl {{ drone.freq.toFixed(2) }} Hz
        button.text-button(@click="drone.stopped = !drone.stopped")
          la-stop(v-if="!drone.stopped")
          la-play(v-else)
    .intervals
      .interval.flex.flex-col.m-1(
        v-for="interval in intervals" :key="interval"
      )
        .flex.flex-wrap
          pitch-drone-voice.m-1(
            v-for="voice in interval.voices" :key="voice"
            :interval="voice"
          )
    .controls
</template>

<script setup>
import { clampNum } from '@use/theory'
import { notes, pitchColor, freqColor, freqPitch, pitchFreq } from 'chromatone-theory'
import { drone } from './drone.js'

function setFreq(drag) {
  drone.freq = clampNum(drone.freq, drag.delta[0] / 10, 55, 220)
}

const intervals = reactive({
  octave: {
    title: '8P',
    voices: [-12, 0, 12],
  },
  fifths: {
    title: '5P',
    voices: [7, 19, 31],
  },
});

</script>

<style scoped>
</style>