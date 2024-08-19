<script setup>
import { computed } from "vue";
import { colord } from "colord";

import { pitchColor, useMidi } from '#/use';
import { useRefSynth } from '#/use/elem/useRefSynth'
import { useScope } from "#/use/elem/useScope";
import { useFFT } from "#/use/elem/useFFT";
import { onKeyDown } from "@vueuse/core";

const { controls, groups, voiceRefs: voices, stopAll, cycleNote, synthEnabled } = useRefSynth()

onKeyDown('Escape', () => { stopAll() })

const { midi } = useMidi()

const color = computed(() => Object.entries(midi.activeNotes).reduce((acc, en) => {
  acc = colord(acc).mix(pitchColor((Number(en[0]) - 9) % 12), Number(en[1]) / 3).toRgbString()
  return acc
}, '#888'))

const FFT = useFFT()

const scope = useScope('synth')

</script>

<template lang="pug">
.flex.flex-wrap.gap-4
  .border-b-2(:style="{ borderColor: color }")
    ElemFFT(:fft="FFT")
  ElemScope.absolute.top-8.left-0.right-0.pointer-events-none(:data="scope" )

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
    .p-1.flex-1.rounded-xl(v-for="voice in voices" :key="voice" :style="{ backgroundColor: pitchColor(voice.midi.value - 9, 3, voice.gate.value ? 1 : 0) }")

  .flex.flex-wrap.gap-2.is-group.p-2.relative(
    v-for="(group, g) in groups" :key="group"
    )
    .text-sm.uppercase.absolute.-top-4.bg-light-300.dark-bg-dark-300.p-1.rounded {{ g }}
    ControlRotary(v-for="(param, p) in group" v-model="controls[`${g}:${p}`]" :min="param.min" :max="param.max" :step="param.step" :param="p")

</template>
