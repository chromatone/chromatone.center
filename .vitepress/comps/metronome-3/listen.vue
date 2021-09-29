<template lang="pug">
.flex.items-center.border-1(
  :class="{ beat: tuner.blink }"
  @click="!tuner.initiated ? init() : tuner.listen = !tuner.listen"
  )
  tabler-ear(v-if="tuner.listen")
  tabler-ear-off(v-else)
  span.ml-1( 
    v-if="!tuner.listen && tuner.bpm > 0",
    @click.stop="$emit('set', tuner.bpm)"
    ) {{ tuner.bpm.toFixed(1) }}
</template>

<script setup>
defineEmits('set')

import { useTuner } from '@use/tuner.js'

const { init, tuner } = useTuner();

</script>

<style scoped>
.beat {
  @apply border-current;
}
</style>