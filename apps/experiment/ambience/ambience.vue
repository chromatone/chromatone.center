<script setup>
import { useRafFn } from '@vueuse/core';
import SimplexNoise from 'simplex-noise';
import {
  NoiseSynth,
  gainToDb,
  dbToGain,
  FFT,
  Gain,
  AutoFilter,
  AutoPanner,
  BitCrusher,
  PanVol,
  Panner,
} from "tone";

const simplex = new SimplexNoise();

function useSimplexMove(coord = 1) {
  const speed = useClamp(useStorage('random-speed', 50), 0.1, 100)
  const count = ref(0)
  const random = ref()
  useRafFn(() => {
    count.value += speed.value / 10000
    random.value = simplex.noise2D(coord, count.value) / 2 + 0.5
  })
  return { speed, count, random }
}


const options = useStorage("ambient-options", {
  noise: {
    type: "brown",
  },
  envelope: {
    attack: 1,
    decay: 0.1,
    sustain: 0.9,
    release: 6,
  },
  volume: 1,
});

function useAmbientNoise() {
  const active = ref(false)
  const gain = new Gain(options.value.volume).toDestination()
  const panner = new Panner(0).connect(gain)
  const synth = new NoiseSynth(options.value).connect(panner)

  const { random, speed } = useSimplexMove()
  watch(random, r => panner.pan.rampTo(r * 2 - 1))

  const { random: volRandom, speed: volSpeed } = useSimplexMove(4)

  watch(volRandom, v => gain.gain.rampTo(v))

  watch(active, a => {
    if (a) {
      synth.triggerAttack()
    } else {
      synth.triggerRelease()
    }
  })

  function dragSpeed(drag) {
    speed.value += drag.delta[0] / 10
    speed.value -= drag.delta[1] / 10
  }

  function dragVolSpeed(drag) {
    volSpeed.value += drag.delta[0] / 10
    volSpeed.value -= drag.delta[1] / 10
  }

  return { synth, active, speed, dragSpeed, dragVolSpeed, random, volRandom, volSpeed }
}

const { synth, active, speed, dragSpeed, random, volRandom, dragVolSpeed, volSpeed } = useAmbientNoise()



</script>

<template lang='pug'>
.flex.flex-col
  .flex.items-center.gap-4
    .text-xl Anbient drone box 
    button.p-2.border-1(@click="active = !active" :class="{ active }") START
  .flex.flex-col.gap-6.items-center.m-4
    .flex
      .font-bold Random
    .flex-1.border-1.border-current.p-1.relative.w-full.cursor-pointer(v-drag="dragSpeed")
      .absolute.p-1.bg-current.left-0.top-0(:style="{ width: random * 100 + '%' }")
      .absolute.p-2.border-current.border-r-2.left-0.-top-1.mix-blend-difference(
        :style="{ width: speed + '%' }"
        )
      .text-xs.absolute.-right-8.-top-1.text-left {{ random.toFixed(2) }}
    .flex-1.border-1.border-current.p-1.relative.w-full.cursor-pointer(v-drag="dragVolSpeed")
      .absolute.p-1.bg-current.left-0.top-0(:style="{ width: volRandom * 100 + '%' }")
      .absolute.p-2.border-current.border-r-2.left-0.-top-1.mix-blend-difference(
        :style="{ width: volSpeed + '%' }"
        )
      .text-xs.absolute.-right-8.-top-1.text-left {{ volRandom.toFixed(2) }}
</template>

<style lang="postcss" scoped>
.active {
  @apply bg-dark-100 text-light-200 dark_bg-light-200 dark_text-dark-200;
}
</style>