<script setup>
import { useString } from '#/use';

const props = defineProps({
  name: { type: String, default: 'center' },
})

const freq = defineModel({ type: Number, default: 220 })

const { note, init, controls, params } = useString('center')

function drag(drag) {
  freq.value = Math.max(1, Math.min(4000, freq.value + drag.delta[0] / 4))
}

const string = reactive({
  pitch: computed(() => freqPitch(freq.value).toFixed()),
  note: computed(() => Frequency(freq.value).toNote()),
  cents: computed(() => calcCents(Frequency(string.note).toFrequency(), freq.value)),
})

</script>

<template lang='pug'>
g.cursor-pointer(
  v-drag="drag" 
  @pointerdown="play(0, 1)"
  @pointerenter="play(0, 1)"
  @pointerover="play(0, 1)"
  @pointercancel="play(0, 0)"
  @pointerleave="play(0, 0)"
  @pointerout="play(0, 0)"
  )
  line(
    x2="100", 
    stroke-width="4", 
    :stroke="freqColor(freq)")
  circle(r="1")
  circle(
    cx="100",
    r="1")
  text(
    x="50" 
    font-weight="bold") {{ string.note }}  {{ string.freq.toFixed(2) }} Hz ({{ string.cents.toFixed() }} cents)
</template>