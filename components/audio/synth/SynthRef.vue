<script setup>
import { computed } from "vue";
import { colord } from "colord";


import { pitchColor, useMidi } from '#/use';
import { useRefSynth } from '#/use/elementary'
import { onKeyDown } from "@vueuse/core";


const { controls, groups, render, voices, stopAll, cycleNote, synthEnabled } = useRefSynth()

onKeyDown('Escape', () => {
  stopAll()
})

const { midi } = useMidi()

const color = computed(() => Object.entries(midi.activeNotes).reduce((acc, en) => {
  acc = colord(acc).mix(pitchColor((Number(en[0]) - 9) % 12), Number(en[1]) / 3).toRgbString()
  return acc
}, '#888'))

</script>

<template lang="pug">
.flex.flex-wrap.gap-4
  AudioAnalysisFFT
  AudioAnalysisScope.absolute.top-8.pointer-events-none(name="synth" :color="color")

  .flex.is-group.p-2
    button.text-button(@click="synthEnabled = !synthEnabled") {{ synthEnabled ? 'ON' : 'OFF' }}
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

  .grid.gap-1.p-1.grid-cols-4.items-center
    .p-1.flex-1.rounded-xl(v-for="voice in voices" :key="voice" :style="{ backgroundColor: pitchColor(voice.midi - 9, 3, voice.gate ? 1 : 0) }")

  .flex.flex-wrap.gap-2.is-group.p-2.relative(
    v-for="(group, g) in groups" :key="group"
    )
    .text-sm.uppercase.absolute.-top-4.bg-light-300.dark-bg-dark-300.p-1.rounded {{ g }}
    ControlRotary(v-for="(param, p) in group" v-model="controls[`${g}:${p}`]" :min="param.min" :max="param.max" :step="param.step" :param="p")



</template>
