<template lang="pug">
.flex.items-center.border-1(
  :class="{ beat: blink }"
  @click="!state.initiated ? init() : listen = !listen"
  )
  tabler-ear(v-if="listen")
  tabler-ear-off(v-else)
  span.ml-1(
    v-if="!listen && state.bpm > 0",
    @click.stop="$emit('set', state.bpm)"
    ) {{ state.bpm.toFixed(1) }}
</template>

<script setup>
import { defineEmit, ref, watch } from 'vue'

defineEmit('set')

import { useTuner } from '@use/tuner.js'

const { init, state, chain } = useTuner();

const listen = ref(false);
const blink = ref(false)
let prevBeat = 0

watch(() => state.frame, frame => {
  if (listen.value) return
  if (state.beat > prevBeat) {
    prevBeat = state.beat
    blink.value = true
    setTimeout(() => {
      blink.value = false
    }, 60)
  }
});


</script>

<style scoped>
.beat {
  @apply border-current;
}
</style>