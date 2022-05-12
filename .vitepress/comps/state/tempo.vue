<script setup>

import { pitchColor } from '@use/calculations'
import { onClickOutside } from '@vueuse/core'


const panel = useStorage('global-tempo-panel', false)
const target = ref(null)
onClickOutside(target, () => {
  panel.value = false
})

</script>

<template lang="pug">
.tempo(:class="{ active: panel }")
  button.p-2(@click.stop="panel = !panel" aria-label="Toggle tempo panel")
    fad-metronome.transition-all.duration-200.text-xl
  client-only
    transition(name="panel")
     state-transport.panel(v-if="panel" ref="target")
</template>

<style lang="postcss" scoped>
.tempo.active {
  @apply bg-light-700 dark_bg-dark-700;
}

.panel {
  @apply absolute right-0 top-$header-height w-full bg-light-700 bg-opacity-90 dark_bg-opacity-90 dark_bg-dark-700;
}
</style>

