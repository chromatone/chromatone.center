<template lang="pug">
.py-16.flex-1.relative.cursor-pointer.rounded-xl.overflow-hidden.text-center.font-bold.border-6.transition-all.duration-300.ease-in-out(
  style="touch-action:none"
  :style="{ borderColor: voice.play ? voice.color : '#3333' }"
  v-drag="vol"
) 
  .vol.-z-5.absolute.left-0.right-0.bottom-0.bg-dark-100.bg-opacity-30.border-t-4.transition-all.duration-300.ease-in-out(
    :style="{ borderColor: voice.color, height: voice.vol * 100 + '%', opacity: voice.play ? 1 : 0.2 }"
  )
  .vol.-z-5.absolute.left-0.right-0.bottom-0.bg-dark-900.bg-opacity-20.border-t-1.transition-all.duration-300.ease-in-out(
    :style="{ height: voice.vol * 100 * voice.lfo + '%', opacity: voice.play ? 1 : 0.2, backgroundColor: voice.color }"
  )
  .pan.-z-5.absolute.left-0.top-0.bottom-0.border-r-2(
    :style="{ width: voice.pan * 50 + 50 + '%', opacity: voice.play ? 1 : 0.2 }"
  )
  .text-2xl.z-100 {{ voice.note }}
</template>

<script setup>

import { clampNum } from '@use/theory'
import { Frequency, Synth, PanVol, gainToDb, LFO, Meter, dbToGain } from 'tone'
import { useVoice } from './drone.js'

const props = defineProps({
  interval: {
    type: Number,
    default: 0,
  },
});

const voice = useVoice(props.interval)

function vol(drag) {
  if (drag.tap) {
    voice.play = !voice.play
    voice.active = voice.play
  }
  voice.vol = clampNum(voice.vol, -drag.delta[1] / 100, 0, 1)
  voice.pan = clampNum(voice.pan, drag.delta[0] / 100, -1, 1)
}

</script>

<style scoped>
</style>