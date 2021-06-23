<template lang="pug">
.flex.flex-wrap.border-1.p-2.m-2.rounded-lg
  push-button(v-model="active" title="NOISE")
  sqnob.w-3rem(
    :min="0"
    :max="1"
    v-model="options.volume"
    :step="0.01"
    param="vol"
  )
  .border-1.p-1.rounded.flex.flex-wrap.m-1
    sqnob(
      :min="0.005"
      :max="4"
      :step="0.01"
      param="ATT"
      v-model="options.envelope.attack"
    )
    sqnob(
      :min="0.005"
      :max="6"
      :step="0.01"
      param="DEC"
      v-model="options.envelope.decay"
    )
    sqnob(
      :min="0.005"
      :max="1"
      :step="0.01"
      param="SUS"
      v-model="options.envelope.sustain"
    )
    sqnob(
      :min="0.005"
      :max="10"
      :step="0.01"
      param="REL"
      v-model="options.envelope.release"
    )
</template>

<script setup>
import { defineProps, reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { NoiseSynth, gainToDb } from 'tone'
import { useStorage } from '@vueuse/core'

const options = useStorage('noise-options', {
  noise: {
    type: 'pink',
  },
  envelope: {
    attack: 0.1,
    decay: 0.1,
    sustain: 0.9,
    release: 1,
  },
  volume: 1,
})

const active = ref(false)

const types = ['brown', 'pink', 'white'];

const synth = new NoiseSynth(options.value).toDestination();

watch(active, (act) => {
  if (act) {
    synth.triggerAttack()
  } else {
    synth.triggerRelease()
  }
});

watch(options.value, () => {
  synth.set(options.value)
});

watch(() => options.value.volume, vol => {
  synth.volume.setValueAtTime(gainToDb(vol))
});

</script>

<style scoped>
</style>