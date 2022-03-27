<script setup>
import { useSynth } from '@use/synth'
import { onClickOutside } from '@vueuse/core'

const open = ref(false);

const panel = ref()

function toggle(ev) {
  open.value = !open.value
}

onClickOutside(panel, (ev) => {
  // if (open.value) ev.stopPropagation()
  open.value = false
})

const { synthOptions, synthOnce, init } = useSynth();
</script>

<template lang="pug">
.btn.w-10
  button.p-2.text-2xl(
    @click.stop.prevent="open = true; !synthOptions.initiated && init()"
    aria-label="Toggle synth panel"
    )
    la-wave-square
  transition(name="panel")
    .panel(v-if="open" ref="panel")
      button.text-button.mute.p-2.flex.flex-col.items-center(
        :class="{ active: synthOptions.initiated }"
        @click="synthOnce()" 
        aria-label="Test synth sound"
        )
        la-wave-square.text-4xl
      synth-oscillators.flex-1(v-model="synthOptions.params.oscillator.type")
      .flex-1
      button.text-button.border(
        @click="synthOptions.midi = !synthOptions.midi" 
        aria-label="Play synth on MIDI input"
        :class="{ active: synthOptions.midi }"
        )
        mdi-midi-input.text-3xl
</template>

<style  scoped>
.mute {
  font-size: 1.1em;
}

.panel {
  @apply absolute right-0 top-$header-height w-full p-4 bg-light-300 dark_bg-dark-300 z-20 flex bg-opacity-90 dark_bg-opacity-90 flex items-center shadow-lg;
}
</style>