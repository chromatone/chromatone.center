<script setup>
import { computed, ref } from "vue";
import { colord } from "colord";

import { globalScale, pitchColor, useMidi } from '#/use';
import { useElemSynth } from '#/use/elem/useElemSynth'
import { useFFT } from "#/use/elem/useElementary";
import { onKeyDown } from "@vueuse/core";

const { controls, groups, voiceRefs: voices, stopAll, cycleNote, synthEnabled, params } = useElemSynth()

onKeyDown('Escape', () => { stopAll() })

const { midi, activeNotes } = useMidi()

const color = computed(() => Object.entries(activeNotes.value).reduce((acc, en) => {
  acc = colord(acc).mix(pitchColor((Number(en[0]) - 9) % 12), Number(en[1]) / 3).toRgbString()
  return acc
}, '#888'))

const FFT = useFFT()

</script>

<template lang="pug">
.flex.flex-wrap.gap-4.relative.p-4

  .flex.is-group.p-2.items-center
    button.text-button(
      :class="{ active: synthEnabled }"
      @click="synthEnabled = !synthEnabled")
      .i-la-power-off
    button.text-button(
      :style="{ backgroundColor: pitchColor(globalScale.tonic, 5) }"
      @mousedown.passive="cycleNote(57 + globalScale.tonic + 12 * midi.offset, 120)"
      @mouseup.passive="cycleNote(57 + globalScale.tonic + 12 * midi.offset)"
      @touchstart.prevent.stop="cycleNote(57 + globalScale.tonic + 12 * midi.offset, 120)"
      @touchend.prevent.stop="cycleNote(57 + globalScale.tonic + 12 * midi.offset)"
      @mouseleave="cycleNote(57 + globalScale.tonic + 12 * midi.offset)"
      )
      .i-la-check
    button.text-button(@click="midi.offset--")
      .i-la-minus
    .text-button {{ midi.offset }}
    button.text-button(@click="midi.offset++")
      .i-la-plus
    button.text-button(@click="stopAll()")
      .i-la-times

  .flex.flex-wrap.gap-2.items-center
    .p-2.flex-1.rounded-xl(v-for="voice in voices" :key="voice" :style="{ backgroundColor: pitchColor(voice.midi.value - 9, 3, undefined, voice.gate.value ? 1 : 0.1) }")

  .flex.flex-wrap.is-group.p-2.relative.items-center(
    v-for="(group, g) in groups" :key="group"
    )
    .text-sm.uppercase.absolute.-top-4.bg-light-300.dark-bg-dark-300.p-1.rounded {{ g }}

    button.text-button(
      :class="{ active: controls[`${g}:on`] == 1 }"
      @click="controls[`${g}:on`] == 1 ? (controls[`${g}:on`] = 0) : (controls[`${g}:on`] = 1)")
      .i-la-power-off
    .p-0.flex.items-center.flex-1.justify-center(v-for="(param, p) in group" :key="p" :style="{ order: p == 'f-env' ? 20 : 1 }")
      ControlRotary(
        v-model="controls[`${g}:${p}`]" :min="param.min" :max="param.max" :step="param.step" :param="p" :interpolation="p == 'cut-off' ? 'log2' : 'linear'" ) 


    .p-0.flex.h-30(v-if="['osc', 'noise', 'string'].includes(g)" style="order:5; flex: 10")
      ControlXY.w-25(
        v-model:x="controls[`${g}:cut-off`]" 
        :rangeX="[params[`${g}:cut-off`].min, params[`${g}:cut-off`].max]"
        :stepX="50"
        v-model:y="controls[`${g}:cut-q`]"
        :rangeY="[params[`${g}:cut-q`].min, params[`${g}:cut-q`].max]"
        :stepY="0.01"
        )
    .p-0.flex(v-if="['osc', 'noise', 'string', 'sample'].includes(g)" style="order:5; flex: 10")
      ControlAdsr.bg-light-400.dark-bg-dark-400.bg-op-30.dark-bg-op-30.rounded-lg(
        title="Amplitude Envelope"
        v-model:a="controls[`${g}:attack`]"
        v-model:d="controls[`${g}:decay`]"
        v-model:s="controls[`${g}:sustain`]"
        v-model:r="controls[`${g}:release`]"
        )
    .p-0(v-if="g == 'osc' || g == 'noise' || g == 'string'" style="order:20;flex: 10")
      ControlAdsr.bg-light-400.dark-bg-dark-400.bg-op-30.dark-bg-op-30.rounded-lg(
        title="Filter Envelope"
        v-model:a="controls[`${g}:f-attack`]"
        v-model:d="controls[`${g}:f-decay`]"
        v-model:s="controls[`${g}:f-sustain`]"
        v-model:r="controls[`${g}:f-release`]"
        )
</template>
