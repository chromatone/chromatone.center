<template lang="pug">
.max-w-55ch.mx-auto.flex.flex-col.items-stretch.w-full.transition-all.duration-500.ease-out.select-none.rounded-2xl.text-white(

  :style="{ backgroundColor: drone.color }"
)

  .drone.w-full.flex-1.justify-center.flex.flex-col.p-2
    .notes.w-full.text-sm.font-bold.text-white.text-center.flex.flex-wrap
      .p-2.m-1.flex-1.cursor-pointer.rounded-xl(
        v-for="note in notes" :key="note"
        :style="{ backgroundColor: pitchColor(note.pitch, 4, drone.pitch == note.pitch ? 1 : 0, drone.pitch == note.pitch ? 1 : 0.4) }"
        @click="drone.pitch = note.pitch"
      ) {{ note.name }}
    .info.flex.flex-col.items-center.is-group.cursor-pointer.transition-all.duration-500.ease-out(
      style="touch-action:none"
      v-drag="setFreq"

    )
      .flex.flex-wrap.items-center.p-2
        .p-1.text-4xl.font-bold {{ drone.note }} 
        .p-1 {{ drone.centDiff }}
        .p-1 {{ drone.cents }} cents
        .p-1.text-xl {{ drone.freq.toFixed(2) }} Hz

    .intervals
      .interval.flex.flex-col.m-1(
        v-for="interval in intervals" :key="interval"
      )
        .flex.flex-wrap
          pitch-drone-voice.m-1(
            v-for="voice in interval.voices" :key="voice"
            :interval="voice"
          )
    .controls.flex.flex-wrap.items-center.justify-center
      button.text-button(@click="drone.stopped = !drone.stopped")
        la-stop(v-if="!drone.stopped")
        la-play(v-else)
      sqnob.w-4em(v-model="drone.volume" :min="0" :max="1" :step="0.05" param="VOL")
      sqnob.w-4em(v-model="drone.filterFreq" :min="55" :max="12000" :step="0.05" :fixed="0" param="LP")
</template>

<script setup>
import { clampNum } from '@use/theory'
import { notes, pitchColor } from 'chromatone-theory'
import { useDrone } from './drone.js'

const drone = useDrone()

function setFreq(drag) {
  drone.freq = clampNum(drone.freq, drag.delta[0] / 10, 27.5, 220)
}

const intervals = reactive({
  fifths: {
    title: '5P',
    voices: [7, 19, 31],
  },
  octave: {
    title: '8P',
    voices: [-12, 0, 12],
  },

});

</script>

<style scoped>
</style>