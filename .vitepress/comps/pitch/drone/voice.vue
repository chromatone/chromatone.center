<template lang="pug">
.p-8.flex-1.relative.cursor-pointer.rounded-xl.overflow-hidden.text-center.font-bold(
  style="touch-action:none"
  :style="{ backgroundColor: voice.color }"
  v-drag="vol"
) {{ voice.note }} {{ voice.lfo.toFixed(1) }}
  .vol.absolute.left-0.right-0.bottom-0.bg-dark-100.bg-opacity-30.border-t-1(
    :style="{ height: voice.vol * 100 + '%', opacity: voice.play ? 1 : 0.2 }"
  )
  .pan.absolute.left-0.top-0.bottom-0.bg-dark-100.bg-opacity-30.border-r-1(

    :style="{ width: voice.pan * 50 + 50 + '%', opacity: voice.play ? 1 : 0.2 }"
  )
</template>

<script setup>
import { freqColor } from 'chromatone-theory'
import { clampNum } from '@use/theory'
import { Frequency, Synth, Panner, gainToDb, LFO, Meter, dbToGain } from 'tone'
import { drone } from './drone.js'
import { useRafFn } from '@vueuse/core'
const props = defineProps({
  freq: {
    type: Number,
    default: 110,
  },
  interval: {
    type: Number,
    default: 0,
  },
  stopped: {
    type: Boolean,
    default: false,
  }
});

const voice = reactive({
  play: false,
  active: false,
  vol: useStorage(`drone-${props.interval}-vol`, 0.8),
  pan: useStorage(`drone-${props.interval}-pan`, 0),
  freq: computed(() => drone.freq * Math.pow(2, (props.interval) / 12)),
  note: computed(() => Frequency(voice.freq).toNote()),
  color: computed(() => freqColor(voice.freq)),
  lfo: 0,
});

let synth, panner, lfo, meter

watch(() => voice.play, play => {
  if (!play) {
    if (synth) {
      synth.triggerRelease()
    }
  } else {
    if (!synth) {
      meter = new Meter({
        normalRange: true
      })
      panner = new Panner().toDestination()
      lfo = new LFO('1m', -0.25, 0.25).connect(panner.pan).connect(meter).start()
      synth = new Synth({
        envelope: {
          attack: 2,
          sustain: 1,
          release: 4
        },
        oscillator: {
          type: 'sawtooth32'
        },
        volume: gainToDb(voice.vol) - 10,
      }).connect(panner)
      mount()
    }
    drone.stopped = false
    synth.triggerAttack(voice.freq)
  }
})

function mount() {
  watch(() => voice.freq, freq => {
    synth.frequency.targetRampTo(freq)
  })
  watch(() => voice.vol, vol => {
    synth.volume.exponentialRampTo(gainToDb(vol) - 10, 1)
  })
  watch(() => voice.pan, pan => {
    panner.pan.targetRampTo(pan, 1)
  })
  const { resume, pause } = useRafFn(() => {
    voice.lfo = meter.getValue()
  })
}

watch(() => drone.stopped, stop => {
  if (stop) { voice.play = false } else {
    voice.play = true
  }
})


function vol(drag) {
  if (drag.tap) {
    voice.play = !voice.play
  }
  voice.vol = clampNum(voice.vol, -drag.delta[1] / 100, 0, 1)
  voice.pan = clampNum(voice.pan, drag.delta[0] / 100, -1, 1)
}

</script>

<style scoped>
</style>