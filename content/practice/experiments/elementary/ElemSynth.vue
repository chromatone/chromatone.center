<script setup lang="ts">
import { notes } from "#/use";
import { pitchColor } from "#/use/calculations";
import ElemScope from "./ElemScope.vue";
import { useSynth } from "./useSynth";

const props = defineProps({
  title: { type: String, default: () => Math.random().toString(36).slice(2, 7) }
})

const { synth, ui } = useSynth(props.title)

</script>

<template lang='pug'>
.flex.flex-col.gap-2.is-group.p-2.bg-light-200.dark-bg-dark-200.shadow.rounded.gap-4 
  .absolute {{ title }}
  .flex.flex-col.relative.mb-3.select-none
    ElemScope.absolute.-top-4.pointer-events-none(:title="title")
    .flex.flex-wrap.gap-1.font-mono.w-full.justify-around
      .text-md.flex.w-8.h-8.text-center.rounded-full.justify-center.items-center.transition.cursor-pointer(
        v-for="voice in synth.voices" :key="voice"
        :style="{backgroundColor:pitchColor(voice.midi-9-24,undefined,undefined,voice.gate ? 1:0.2), opacity: voice.gate ? 1:0.5}"
        @mousedown="voice.gate = 1"
        @mouseup="voice.gate = 0"
        @mouseleave="voice.gate=0"
        ) {{ notes[(voice.midi-9)%12] }}
  .flex.flex-wrap.gap-4.flex-1
    button.text-button(@click="synth.stopAll()")
      .i-la-stop
    .flex.flex-wrap.is-group.p-2.gap-2.items-center.relative(v-for="(group,title) in ui.groups" :key="title") 
      .text-sm.uppercase.absolute.-top-4.bg-light-300.dark-bg-dark-300.p-1.rounded {{ title }}
      control-rotary(
        v-for="param in group" :key="param.name"
        :step="param.step"
        v-model="ui.controls[param.name]"
        :min="param.min"
        :max="param.max"
        :param="param.name.split(':').pop()")
    .flex.gap-4.flex-1
      //- button.text-button.flex-1(
        @mousedown.passive="synth.cycleNote(60, 120)"
        @mouseup.passive="synth.cycleNote(60)"
        @touchstart.prevent.stop="synth.cycleNote(60, 120)"
        @touchend.prevent.stop="synth.cycleNote(60)"
        @mouseleave="synth.cycleNote(60)"
        ) PLAY A NOTE


</template>