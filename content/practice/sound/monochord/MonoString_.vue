<script setup>
import { freqColor, freqPitch } from '#/use/calculations'
import { Frequency } from 'tone'
import { computed, onMounted, reactive, ref } from 'vue'
import { useString } from '#/use'

const props = defineProps({
  name: { type: String, default: '' },
})

const freq = defineModel({ type: Number, default: 220 })

const { note, init, controls, params } = useString(props.name)

const initiated = ref(false)

function drag(drag) {
  freq.value = Math.max(1, Math.min(4000, freq.value + drag.delta[0] / 4))
}

const string = reactive({
  pitch: computed(() => freqPitch(freq.value).toFixed()),
  note: computed(() => Frequency(freq.value).toNote()),
  cents: computed(() => calcCents(Frequency(string.note).toFrequency(), freq.value)),
})

const toMIDI = (freq) => 69 + 12 * Math.log2(freq / 440)

function play(vel = .5) {
  if (!initiated.value) { init(); setTimeout(() => { initiated.value = true }, 200); return }
  Object.assign(note, { number: toMIDI(freq.value).toFixed(4), velocity: vel })
}

function calcCents(base, freq) {
  return -(1200 / Math.log10(2)) * (Math.log10(base / freq)) % 1200
}

</script>

<template lang='pug'>
g.cursor-pointer(
  v-drag="drag" 
  @pointerdown="play(1)"
  @pointerenter="play(1)"
  @pointerover="play(1)"
  @pointercancel="play(0)"
  @pointerleave="play(0)"
  @pointerout="play(0)"
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
    font-weight="bold") {{ string.note }}  {{ freq.toFixed(2) }} Hz ({{ string.cents.toFixed() }} cents)
</template>