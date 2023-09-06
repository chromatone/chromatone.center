<script setup>
import { reactive } from 'vue'

import { noteColor } from "#/use/colors";
import { notes } from "#/use/theory";
import { useDrone } from "./useDrone";

const drone = useDrone();

function setFreq(drag) {
  drone.freq += drag.delta[0] / 10;
}

const intervals = reactive({
  fifths: {
    title: "5P",
    voices: [7, 19, 31],
  },
  octave: {
    title: "8P",
    voices: [-12, 0, 12],
  },
});
</script>

<template lang="pug">
.flex.flex-col.items-stretch.w-full.transition-all.duration-500.ease-out.select-none.rounded-3xl.shadow-xl.border-8(
  :style="{ borderColor: drone.color }"
)
  .drone.w-full.flex-1.justify-center.flex.flex-col.p-2
    .intervals.my-2
      .interval.flex.flex-col.m-1(
        v-for="interval in intervals" 
        :key="interval"
      )
        .flex.flex-wrap
          pitch-drone-voice.m-2(
            v-for="voice in interval.voices" 
            :key="voice"
            :interval="voice"
          )
    .info.my-4.flex.flex-wrap.justify-stretch.items-center.touch-none
      .flex.flex-wrap.p-4.mx-2.flex-1.min-w-10em.items-center.rounded-xl.text-white.p-2.cursor-pointer.transition-all.duration-500.ease-out(
        v-drag="setFreq" 
        :style="{ backgroundColor: drone.color }")
        .p-1.text-4xl.font-bold {{ drone.note }} 
        .p-1 {{ drone.centDiff }}
        .p-1 {{ drone.cents }} cents
        .p-1.text-xl {{ drone.freq.toFixed(2) }} Hz
      .controls.min-w-10em.flex-1.my-2.p-2.flex.flex-wrap.items-center.justify-center.is-group.gap-2
        button.text-button.text-3xl(@click="drone.stopped = !drone.stopped")
          .i-la-stop(v-if="!drone.stopped")
          .i-la-play(v-else)
        .is-group.flex.p-2.gap-2
          control-rotary.w-4em(
            v-model="drone.volume" 
            :min="0" 
            :max="1" 
            :step="0.05" 
            param="VOL")
          control-rotary.w-4em(
            v-model="drone.filterFreq" 
            :min="55" 
            :max="12000" 
            :step="0.05" 
            :fixed="0" 
            param="LP")
    .notes.w-full.text-sm.font-bold.text-center.flex.flex-wrap
      .p-2.m-1.flex-1.cursor-pointer.rounded-xl(
        v-for="(note, pitch) in notes" 
        :key="note"
        :style="{ backgroundColor: noteColor(pitch, 3, drone.pitch == pitch ? 1 : 0.2, drone.pitch == pitch ? 1 : 0.4) }"
        @click="drone.pitch = pitch"
      ) {{ note }}
</template>

<style lang="postcss" scoped></style>
