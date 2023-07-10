<script setup>
import { pitchColor } from "#/use/calculations";
import { useMic } from "./useMic";
import { useSynth } from "./useSynth";
import OscilloScope from "./OscilloScope.vue";

const { synth, ui } = useSynth();
const mic = useMic();
</script>

<template lang="pug">
.p-4.bg-light-200.dark-bg-dark-200.shadow.rounded.flex.flex-col.gap-4
  .text-2xl.p-2 Elementary audio
  OscilloScope

  .flex.flex-wrap.gap-4
    .flex.flex-wrap.is-group.p-2.gap-2.items-center.relative(v-for="(group,title) in ui.groups" :key="group.name") 
      .text-sm.uppercase.absolute.-top-4.bg-light-300.dark-bg-dark-300.p-1.rounded {{ title }}
      control-rotary(
        v-for="param in group" :key="param.name"
        :step="param.step"
        v-model="ui.controls[param.name]"
        :min="param.min"
        :max="param.max"
        :param="param.name.split(':').pop()")

  .flex.gap-4
    button.text-button(@click="mic.isOpen = !mic.isOpen" :class="{['text-red-500']:mic.isOpen}") Open mic
    button.text-button.flex-1(
      @mousedown.passive="synth.cycleNote(60, 120)"
      @mouseup.passive="synth.cycleNote(60)"
      @touchstart.prevent.stop="synth.cycleNote(60, 120)"
      @touchend.prevent.stop="synth.cycleNote(60)"
      @mouseleave="synth.cycleNote(60)"
      ) PRESS TO PLAY A NOTE
    button.text-button(@click="synth.stopAll()") STOP ALL

  .flex.flex-col.gap-1.font-mono
    .text-xs.flex(
      v-for="voice in synth.voices" :key="voice"
      :style="{color:pitchColor(voice.midi-9), opacity: voice.gate ? 1:0.5}") 
      .p-1(
        v-for="(value,param) in voice" :key="param"
        ) {{ param }}:{{ value }}

</template>
