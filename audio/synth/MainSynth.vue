<script setup>
import { useMidi, notes } from "#/use";
import { pitchColor } from "#/use/calculations";
import { computed } from "vue";
import AnalysisScope from "../analysis/AnalysisScope.vue";
import { useSynth } from "./useSynth";
import { colord } from "colord";

const { groups, controls, voices, cycleNote, stopAll } = useSynth()

const { midi } = useMidi()

const color = computed(() => Object.entries(midi.activeNotes).reduce((acc, en) => {
  acc = colord(acc).mix(pitchColor((Number(en[0]) - 9) % 12), Number(en[1]) / 3).toRgbString()
  return acc
}, '#888'))

</script>

<template lang='pug'>
.flex.flex-col.gap-2.is-group.p-2.bg-light-200.dark-bg-dark-200.shadow.rounded.gap-4 
  .flex.flex-col.relative.mb-3.select-none
    AnalysisScope.absolute.-top-4.pointer-events-none(name="synth" :color="color")
    .flex.flex-wrap.gap-1.font-mono.w-full.justify-around
      .text-md.flex.w-8.h-8.text-center.rounded-full.justify-center.items-center.transition.cursor-pointer(
        v-for="(voice,v) in voices.list" :key="v"
        :style="{backgroundColor:pitchColor(voice.midi-9-24,3,undefined,voice.gate ? 1:0.2), opacity: voice.gate ? 1:0.5}"
        @mousedown="voice.gate = 1"
        @mouseup="voice.gate = 0"
        @mouseleave="voice.gate=0"
        ) {{ notes[(voice.midi-9)%12] }}

  .flex.flex-wrap.gap-2.flex-1
    button.text-button(
      @mousedown.passive="cycleNote(69, 120)"
      @mouseup.passive="cycleNote(69)"
      @touchstart.prevent.stop="cycleNote(69, 120)"
      @touchend.prevent.stop="cycleNote(69)"
      @mouseleave="cycleNote(69)"
      )
      .i-la-play

    button.text-button(@click="stopAll()")
      .i-la-stop

    .flex.flex-wrap.is-group.p-2.gap-2.items-center.relative(v-for="(group,title) in groups" :key="title") 
      .text-sm.uppercase.absolute.-top-4.bg-light-300.dark-bg-dark-300.p-1.rounded {{ title }}
      control-rotary(
        v-for="(param,p) in group" :key="p"
        :step="param.step"
        v-model="controls[`${title}:${p}`]"
        :min="param.min"
        :max="param.max"
        :param="p")
    .flex.gap-4.flex-1
     
</template>