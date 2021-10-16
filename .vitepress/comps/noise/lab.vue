<template lang="pug">
.row
  push-button(v-model="active" title="NOISE")
  sqnob.w-3rem(
    :min="0"
    :max="1"
    v-model="options.volume"
    :step="0.01"
    param="DRY"
  )
  choose(
    v-model="options.noise.type"
    :variants="types"
  )
  .group
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
  svg.w-8rem.border-1.rounded-lg.m-1(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 32 10",
    xmlns="http://www.w3.org/2000/svg",
  )
    line(
      v-for="(fr,i) in fftFreq"
      :key="fr"
      stroke-width="1"
      stroke="gray"
      :x1="i"
      :x2="i"
      :y2="10"
      :y1="10 - fftData[i] * 50"
      :title="fftFreq[i]"
    )
.row
  .flex.flex-wrap
    push-button(
      title="FILTER"
      v-model="filterOptions.on"
    )
    sqnob.w-3rem(
      param="VOL"
      :min="0"
      :max="1"
      :step="0.01"
      :fixed="1"
      v-model="filterOptions.volume"
    )
    sqnob.w-4rem(
      param="FREQ"
      :min="10"
      :max="999"
      :step="1"
      :fixed="0"
      unit="hz"
      v-model="filterOptions.baseFrequency"
    )
    sqnob.w-3rem(
      param="OCT"
      :min="0.1"
      :max="7"
      :step="0.1"
      :fixed="1"
      v-model="filterOptions.octaves"
    )
    sqnob.w-3rem(
      param="Q"
      :min="0.1"
      :max="20"
      :step="0.1"
      :fixed="1"
      v-model="filterOptions.filter.Q"
    )
    sqnob(
      param="WET"
      :min="0"
      :max="1"
      :step="0.1"
      :fixed="1"
      unit=""
      v-model="filterOptions.wet"
    )
    choose(
      v-model="filterOptions.filter.type"
      :variants="filterTypes"
    ) 
  .flex.flex-wrap
    push-button(
      title="PLAY"
      v-model="filterOptions.play"
    )
    sqnob.w-4rem(
      param="LFO"
      :min="0.01"
      :max="4"
      :step="0.01"
      :fixed="2"
      unit="hz"
      v-model="filterOptions.frequency"
    )
    sqnob.w-4rem(
      param="DPTH"
      :min="0"
      :max="1"
      :step="0.1"
      :fixed="1"
      unit=""
      v-model="filterOptions.depth"
    )
    choose(
      v-model="filterOptions.type"
      :variants="filterLFOTypes"
    )
.row
  push-button(
    title="BITCRUSHER"
    v-model="crusherOptions.on"
    )

  sqnob.w-4rem(
    param="VOL"
    :min="0.01"
    :max="1"
    :step="0.01"
    :fixed="1"
    v-model="crusherOptions.volume"
  )
  sqnob.w-4rem(
    param="BITS"
    :min="1"
    :max="16"
    :step="0.01"
    :fixed="2"
    v-model="crusherOptions.bits"
  )
  sqnob.w-4rem(
    param="WET"
    :min="0"
    :max="1"
    :step="0.1"
    :fixed="1"
    unit=""
    v-model="crusherOptions.wet"
  )
.row
  push-button(
    title="PAN"
    v-model="pannerOptions.on"
    )
  push-button(
    title="PLAY"
    v-model="pannerOptions.play"
    )
  sqnob.w-4rem(
    param="VOL"
    :min="0.01"
    :max="1"
    :step="0.01"
    :fixed="1"
    v-model="pannerOptions.volume"
  )
  sqnob.w-4rem(
    param="LFO"
    :min="0.01"
    :max="4"
    :step="0.01"
    :fixed="2"
    unit="hz"
    v-model="pannerOptions.frequency"
  )
  sqnob.w-4rem(
    param="DPTH"
    :min="0"
    :max="1"
    :step="0.1"
    :fixed="1"
    unit=""
    v-model="pannerOptions.depth"
  )
  sqnob.w-4rem(
    param="WET"
    :min="0"
    :max="1"
    :step="0.1"
    :fixed="1"
    unit=""
    v-model="pannerOptions.wet"
  )


</template>

<script setup>
import { reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { NoiseSynth, gainToDb, dbToGain, FFT, Gain, AutoFilter, AutoPanner, BitCrusher } from 'tone'
import { useStorage, useRafFn, onKeyStroke } from '@vueuse/core'

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

const filterOptions = useStorage('filter-options', {
  on: false,
  play: false,
  volume: 1,
  baseFrequency: 50,
  depth: 0.1,
  frequency: 1,
  octaves: 2,
  wet: 1,
  type: 'sine',
  filter: {
    Q: 1,
    type: 'lowpass'
  }
})

const pannerOptions = useStorage('panner-options', {
  on: false,
  play: false,
  wet: 1,
  frequency: 1,
  depth: 1,
  volume: 1,
})

const crusherOptions = useStorage('bit-options', {
  on: false,
  bits: 16,
  wet: 1,
  volume: 1,
})

const active = ref(false)
const fftData = ref([])
const fftFreq = ref([])
const types = { brown: 'brown', pink: 'pink', white: 'white' };
const filterTypes = { lowpass: 'LP', highpass: 'HP', bandpass: 'BP' };
const filterLFOTypes = { sine: 'SIN', triangle: 'TRI', square: 'SQR', sawtooth: 'SAW' }
const fft = new FFT({ size: 512, smoothing: 0.2 }).toDestination()


for (let j = 0; j < 32; j++) {
  fftFreq.value[j] = fft.getFrequencyOfIndex(j)
}
const gain = new Gain(options.value.volume).connect(fft);
const filterGain = new Gain(filterOptions.value.volume).connect(fft)
const pannerGain = new Gain(pannerOptions.value.volume).connect(fft)
const crusherGain = new Gain(crusherOptions.value.volume).connect(fft)
const panner = new AutoPanner(pannerOptions.value).connect(pannerGain)
const crusher = new BitCrusher(crusherOptions.value).connect(crusherGain).connect(panner)

const filter = new AutoFilter(filterOptions.value).connect(filterGain).connect(crusher)
const synth = new NoiseSynth(options.value).connect(gain).connect(filter)

const { pause, resume } = useRafFn(() => {
  let arr = fft.getValue()
  for (let j = 0; j < 32; j++) {
    fftData.value[j] = dbToGain(arr[j]) * 10
  }
})

onKeyStroke(' ', (e) => {
  e.preventDefault()
  active.value = true
}, { eventName: 'keydown' })

onKeyStroke(' ', (e) => {
  active.value = false
}, { eventName: 'keyup' })

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
  gain.gain.rampTo(vol, 1)
});

onBeforeUnmount(() => {
  synth.triggerRelease()
});

watch(filterOptions.value, opt => {
  opt.play ? filter.start() : filter.stop()
  opt.on ? filterGain.gain.rampTo(filterOptions.value.volume, 0.2) : filterGain.gain.rampTo(0, 0.2)
  filter.set(opt)
});

watch(pannerOptions.value, opt => {
  opt.play ? panner.start() : panner.stop()
  opt.on ? pannerGain.gain.rampTo(pannerOptions.value.volume, 0.2) : pannerGain.gain.rampTo(0, 0.2)
  panner.set(opt)
});

watch(crusherOptions.value, opt => {
  opt.on ? crusherGain.gain.rampTo(crusherOptions.value.volume, 0.2) : crusherGain.gain.rampTo(0, 0.2)
  crusher.set(opt)
});

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               </script>

<style scoped>
.row {
  @apply my-2 flex flex-wrap border-1 p-2 rounded-lg max-w-65ch mx-auto;
}

.group {
  @apply border-1 border-dark-100/50 dark:(border-light-100/50) p-1 rounded-md flex flex-wrap m-1;
}
</style>