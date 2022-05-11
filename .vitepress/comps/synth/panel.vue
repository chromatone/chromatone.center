<script setup>
import { useSynth, quantizeModes } from '@use/synth'
import { onClickOutside } from '@vueuse/core'
import { midi } from '@use/midi'

const open = ref(false);

const panel = ref()

function toggle(ev) {
  open.value = !open.value
}

onClickOutside(panel, (ev) => {
  // if (open.value) ev.stopPropagation()
  open.value = false
})

const { synth, synthOnce, init } = useSynth();

let count = 0

function cycle() {
  count++
  synth.state.quantize = quantizeModes[count % quantizeModes.length]
}
</script>

<template lang="pug">
.btn.w-10
  button.p-2.text-xl(
    @click.stop.prevent="open = true; !synth.state.initiated && init()"
    aria-label="Toggle synth panel"
    )
    la-wave-square
  transition(name="panel")
    .panel(v-if="open" ref="panel")
      button.text-button.mute.p-2.flex.flex-col.items-center(
        :class="{ active: synth.state.initiated }"
        @click="synthOnce()" 
        aria-label="Test synth sound"
        )
        la-wave-square.text-4xl
      synth-oscillators.flex-1(v-model="synth.params.oscillator.type")
      button.text-button(
        @click="cycle"
        aria-label="Synth panel"
        ) Quantize {{ synth.state.quantize }}
      .flex-1
      button.text-button.border(
        @click="midi.keyboard = !midi.keyboard" 
        aria-label="Play MIDI with PC keyboard"
        :class="{ active: midi.keyboard }"
        )
        tabler-keyboard.text-3xl
      button.text-button.border(
        @click="synth.state.midi = !synth.state.midi" 
        aria-label="Play synth on MIDI input"
        :class="{ active: synth.state.midi }"
        )
        mdi-midi-input.text-3xl
</template>

<style lang="postcss" scoped>
.mute {
  font-size: 1.1em;
}

.panel {
  @apply absolute right-0 top-$header-height w-full p-4 bg-light-300 dark_bg-dark-300 z-20 flex bg-opacity-90 dark_bg-opacity-90 flex items-center shadow-lg;
}
</style>