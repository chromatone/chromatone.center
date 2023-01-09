<script setup>
import { useSynth, quantizeModes } from "#/use/synth";
import { midi } from "#/use/midi";
import { useCycleList } from '@vueuse/core'
import { pitchFreq, freqColor } from '#/use/calculations'
import { reactive, computed, watch } from 'vue'

const { synth, synthOnce, init, synthReleaseAll } = useSynth();

let count = 0;

function cycle() {
  count++;
  synth.state.quantize = quantizeModes[count % quantizeModes.length];
}


const partials = reactive([1, 0.2, 1, 0, 0, 1, 0.2, 0.2])

const octaves = useCycleList([-2, -1, 0, 1, 2], { initialValue: midi.offset })

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
      @click="synthOnce()" 
      aria-label="Test synth sound"
      v-tooltip.top="'Test synth sound'"
      )
      .i-la-wave-square.text-xl
      .m-0 Play synth
    button.flex-button(
      @click="synthReleaseAll()"
      aria-label="Panic synth release"
      v-tooltip.top="'Panic synth release'"
      )
      .i-la-ban.text-xl
      .m-0 Stop synth
  .flex.flex-wrap.gap-2
    synth-oscillators.is-group(v-model="synth.params.oscillator.type" v-tooltip.top="'Select oscillator type'")
    control-rotary(
      :min="0"
      :max="2"
      :step="0.001"
      v-model="synth.state.volume"
      param="VOL"
      v-tooltip.top="'Synth volume'"
      )
  .flex.flex-wrap
    .p-1(v-for="(part, p) in partials" :key="p")
      control-knob.w-10.transition(
        :min="0" :max="1" :step="0.01" 
        v-model="partials[p]" :param="p + ''" 
        :style="{ color: freqColor(frequency * (p + 1)) }"
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
  .flex.flex-wrap
    button.flex-button.border(
      @click="midi.keyboard = !midi.keyboard" 
      aria-label="Play MIDI with PC keyboard"
      :class="{ active: midi.keyboard }"
      v-tooltip.bottom="'Toggle synth on PC keyboard'"
      )
      .i-tabler-keyboard.text-2xl
      .m-0 Pc Keyboard
    button.flex-button.border(
      @click="synth.state.midi = !synth.state.midi" 
      aria-label="Play synth on MIDI input"
      v-tooltip.bottom="'Toggle synth on MIDI input'"
      :class="{ active: synth.state.midi }"
      )
      .i-mdi-midi-input.text-2xl
      .m-0 MIDI Synth
</template>

<style lang="postcss" scoped>
.mute {
  font-size: 1.1em;
}

.panel {
  @apply absolute right-0 top-$header-height w-full p-4 bg-light-300 dark-bg-dark-300 z-20 flex bg-opacity-90 dark-bg-opacity-90 flex-wrap items-center shadow-lg;
}
</style>
