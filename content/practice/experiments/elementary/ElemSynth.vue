<script setup lang="ts">
import { notes } from "#/use";
import { pitchColor } from "#/use/calculations";
import OscilloScope from "./Oscilloscope.vue";
import { useSynth } from "./useSynth";
const { synth, ui } = useSynth()

</script>

<template lang='pug'>
.flex.flex-col.gap-2.is-group.p-2
  .flex.flex-col.relative.mb-3
    OscilloScope.absolute.-top-4(name="synth")
    .flex.flex-wrap.gap-1.font-mono.w-full.justify-around
      .text-md.flex.w-8.h-8.text-center.rounded-full.justify-center.items-center.transition(
        v-for="voice in synth.voices" :key="voice"
        :style="{backgroundColor:pitchColor(voice.midi-9-24,undefined,undefined,voice.gate ? 1:0.2), opacity: voice.gate ? 1:0.5}") {{ notes[(voice.midi-9)%12] }}
  .flex.flex-wrap.gap-4
    .flex.flex-wrap.is-group.p-2.gap-2.items-center.relative(v-for="(group,title) in ui.groups" :key="title") 
      .text-sm.uppercase.absolute.-top-4.bg-light-300.dark-bg-dark-300.p-1.rounded {{ title }}
      control-rotary(
        v-for="param in group" :key="param.name"
        :step="param.step"
        v-model="ui.controls[param.name]"
        :min="param.min"
        :max="param.max"
        :param="param.name.split(':').pop()")
  .flex.gap-4
    button.text-button.flex-1(
      @mousedown.passive="synth.cycleNote(60, 120)"
      @mouseup.passive="synth.cycleNote(60)"
      @touchstart.prevent.stop="synth.cycleNote(60, 120)"
      @touchend.prevent.stop="synth.cycleNote(60)"
      @mouseleave="synth.cycleNote(60)"
      ) PLAY A NOTE
    button.text-button(@click="synth.stopAll()") STOP ALL

</template>