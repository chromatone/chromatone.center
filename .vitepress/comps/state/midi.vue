<script setup>
import { useMidi } from '@use/midi.js'
import { pitchColor } from '@theory'
import { onClickOutside } from '@vueuse/core'


const panel = useStorage('global-midi-panel', false)
const target = ref(null)
onClickOutside(target, () => {

  panel.value = false
})

const { midi } = useMidi();
</script>

<template lang="pug">
.midi(
  :class="{ active: panel }"
  )
  button.p-2(@click.stop="panel = !panel" aria-label="Toggle MIDI panel")
    mdi-midi-input.transition-all.duration-200.text-2xl(
      :style=`{
        opacity: midi.enabled ? 1 : 0.2,
        color: pitchColor(midi.enabled ? midi.note?.pitch : 0, midi.note?.octA)
      }`
      class="visible"
    )
  client-only
    transition(name="panel")
      midi-panel.panel(v-if="panel" ref="target")
</template>

<style scoped>
.midi.active {
  @apply bg-light-700 dark_bg-dark-700;
}

.panel {
  @apply absolute right-0 top-$header-height w-full;
}
</style>