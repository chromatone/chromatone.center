<script setup>
import { useSynth, quantizeModes } from "#/use/synth";
import { midi } from "#/use/midi";
import { useCycleList } from '@vueuse/core'
import { pitchFreq, freqColor } from '#/use/calculations'
import { reactive, computed, watch } from 'vue'

const { synth, once, releaseAll } = useSynth();

let count = 0;

function cycle() {
  count++;
  synth.state.quantize = quantizeModes[count % quantizeModes.length];
}


const partials = reactive([1, 0.2, 1, 0, 0, 1, 0.2, 0.2])

const octaves = useCycleList([-3, -2, -1, 0, 1, 2, 3], { initialValue: midi.offset })

watch(partials, () => {
  synth.poly.set({ oscillator: { partials: [...partials] } })
  console.log('set')
})

const frequency = computed(() => {
  return pitchFreq(midi.note.pitch, midi.note.octA)
})

</script>

<template lang="pug">
.flex.flex-col.w-full.gap-2 
  .flex.flex-wrap
    button.flex-button(
      :class="{ active: synth.state.initiated }"
      @click="once()" 
      aria-label="Test synth sound"
      v-tooltip.top="'Test synth sound'"
      )
      .i-la-wave-square.text-xl
      .m-0 Play synth
    button.flex-button(
      @click="releaseAll()"
      aria-label="Panic synth release"
      v-tooltip.top="'Panic synth release'"
      )
      .i-la-ban.text-xl
      .m-0 Stop synth
    button.flex-button.border.opacity-30(
      @click="synth.state.midi = !synth.state.midi" 
      :class="{ active: synth.state.midi }"
      v-tooltip.bottom="'Play synth on MIDI input'"
      )
      .i-bi-volume-up(v-if="synth.state.midi")
      .i-bi-volume-off(v-else)
      .m-0 MIDI Synth
  .flex.flex-wrap.gap-2
    control-rotary(
      :min="0"
      :max="2"
      :step="0.001"
      v-model="synth.state.volume"
      param="VOL"
      v-tooltip.top="'Synth volume'"
      )
    synth-oscillators.is-group(v-model="synth.params.oscillator.type" v-tooltip.top="'Select oscillator type'")

  .flex.flex-wrap
    .p-1(v-for="(part, p) in partials" :key="p")
      control-knob.transition(
        :min="0" :max="1" :step="0.01" 
        v-model="partials[p]" :param="p + ''" 
        :style="{ color: freqColor(frequency * (p + 1)) }"
        )
  .is-group.flex.relative
    .text-sm.absolute.-top-4.bg-light-300.px-1.rounded.dark-bg-dark-400 Delay
    control-rotary(
      :min="0"
      :max="1"
      :step="0.001"
      v-model="synth.delayParams.feedback"
      param="Feedback"
      v-tooltip.top="'Synth delay feedback ratio'"
      )
    control-rotary(
      :min="0"
      :max="1"
      :step="0.001"
      v-model="synth.delayParams.wet"
      param="Wet"
      v-tooltip.top="'Synth delay wet'"
      )
  .flex.is-group
    button.flex-button(
      @click="synth.state.quantize.next()"
      aria-label="Synth panel"
      v-tooltip.bottom="'Synth quantization'"
      ) Quantize 
      .font-bold {{ synth.state.quantize.state }}
    button.flex-button(
      v-tooltip.bottom="'Octave offset'"
      @click="midi.offset = octaves.next()"
      ) Octave
      .font-bold {{ midi.offset > 0 ? '+' : '' }}{{ midi.offset }}

</template>

<style lang="postcss" scoped>
.mute {
  font-size: 1.1em;
}

.panel {
  @apply absolute right-0 top-$header-height w-full p-4 bg-light-300 dark-bg-dark-300 z-20 flex bg-opacity-90 dark-bg-opacity-90 flex-wrap items-center shadow-lg;
}

button {
  @apply p-2 m-2 border flex items-center rounded cursor-pointer select-none;
}

button.active {
  @apply opacity-100;
}
</style>
