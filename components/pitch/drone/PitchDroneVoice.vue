<script setup>
import { useVoice } from './useDrone'
import { ref } from 'vue'
import { useGesture } from '@vueuse/gesture';

const props = defineProps({
  interval: { type: Number, default: 0, },
});

const voice = useVoice(props.interval)

function vol(drag, delta) {
  if (drag.tap) {
    voice.play = !voice.play
    voice.active = voice.play
  }
  voice.vol -= delta[1] / 400
  voice.pan += delta[0] / 100
}

const control = ref()

useGesture({
  onDrag(ev) {
    ev?.event?.preventDefault()
    vol(ev, ev.delta)
  },
  onWheel(ev) {
    ev?.event?.preventDefault()
    vol(ev, ev.velocities.map(v => -v))
  }
}, {
  domTarget: control,
  eventOptions: { passive: false }
})

</script>

<template lang="pug">
.py-16.flex-1.relative.cursor-pointer.rounded-xl.overflow-hidden.text-center.font-bold.border-6.touch-none(
  ref="control"
  :style="{ borderColor: voice.play ? voice.color : '#3333' }"
) 
  .vol.-z-5.absolute.left-0.right-0.bottom-0.bg-dark-100.bg-opacity-30.border-t-4(
    :style="{ borderColor: voice.color, height: voice.vol * 100 + '%', opacity: voice.play ? 1 : 0.2 }"
  )
  .vol.-z-5.absolute.left-0.right-0.bottom-0.bg-dark-900.bg-opacity-20.border-t-1(
    :style="{ height: voice.vol * 100 * voice.lfo + '%', opacity: voice.play ? 1 : 0.2, backgroundColor: voice.color }"
  )
  .pan.-z-5.absolute.left-0.top-0.bottom-0.border-r-2(
    :style="{ width: voice.pan * 50 + 50 + '%', opacity: voice.play ? 1 : 0.2 }"
  )
  .text-2xl.z-100 {{ voice.note }}
</template>

<style lang="postcss" scoped></style>