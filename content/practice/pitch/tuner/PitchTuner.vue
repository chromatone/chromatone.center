<script setup>
import { noteColor } from "#/use/colors"
import { useTuner } from '#/use/tuner'
import { computed } from 'vue'

import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()

const { init, tuner, } = useTuner();

const background = computed(() => {
  const note = getRawNote(tuner.note?.frequency)
  if (!note) return '#333'
  const octave = tuner.note?.octave
  const color = noteColor(note, octave)
  return color
})

function start() {
  init();
}

function getRawNote(frequency) {
  return 12 * (Math.log(frequency / tuner.middleA) / Math.log(2)) % 12
}


</script>

<template lang="pug">
.fullscreen-container#screen.overflow-clip 
  control-start.absolute.z-20(
    v-if="!tuner.running", 
    @click="start()") Start tuner
  svg#tuner(
    :opacity="tuner.running ? 1 : 0.3"
    version="1.1",
    baseProfile="full",
    font-family="Commissioner, sans-serif"
    stroke-linecap="round"
    dominant-baseline="middle"
    text-anchor="middle",
    :viewBox="`0 0 ${width} ${height}`",
    xmlns="http://www.w3.org/2000/svg",
    )
    defs
      linearGradient#grad(
        x1="0" 
        x2="0" 
        y1="0" 
        y2="1")
        stop(
          :stop-color="background" 
          stop-opacity="1" 
          offset="0%")
        stop(
          :stop-color="background" 
          stop-opacity="1" 
          offset="10%")
        stop(
          :stop-color="background" 
          stop-opacity="0.8" 
          offset="50%")
        stop(
          :stop-color="background" 
          stop-opacity="0.2" 
          offset="100%")

    rect(
      :width
      :height
      rx="5"
      fill="url(#grad)"
      )
    g.spectrum
      line(
        v-for="(bar, i) in tuner.spec.slice(0, 100)",
        :key="i",
        style="transition:all 200ms ease; "
        stroke="currentColor"
        stroke-width="2"
        :x1="i * width / 100",
        :y1="height",
        :x2="i * width / 100",
        :y2="height - bar * 4"
        )

    g.clock(:style="{ transform: `translate(${width / 2}px,${height * .75}px)` }")
      circle.center(r="4" fill="currentColor")
      g.notes
        circle(
          v-for="n in 12" :key="n" r="8" 
          :fill="noteColor(n, 4)"
          cy="-100"
          :transform="`rotate(${n * 30})`"
          )
      g.transition.duration-700(:style="{ transform: `rotate(${(tuner.note.value + 3) * 30}deg)` }")
        line( y2="-100" stroke="currentColor" stroke-width="4" )
        line.transition.duration-700( y2="-80" stroke="currentColor" stroke-width="2" :style="{ transform: `rotate(${tuner.note.cents * 3.6}deg)` }")

    g.center(
      :transform="`translate(${width / 2},0)`"
      )
      circle.op-20(
        r="8"
        fill="currentColor"
        :cy="height * .3"
        )
      g(
        v-for="(n) in 11",
        :key="n",
        :style="{ transform: `translateX(${width / 12 * (n - 6)}px)` }"
        )
        line(
          stroke="gray"
          opacity="0.7"
          stroke-width="2"
          :y1="60"
          :y2="height * .3"
        )
        text(
          style="user-select:none;transition:all 300ms ease; "
          fill="gray"
          font-size="20px"
          text-anchor="middle",

          y="40"
        ) {{ (n - 6) * 10 }} 
      g.meter(
        style="user-select:none;transition:all 600ms ease; "
        :style="{ transform: `translateX(${(width / 100) * tuner.note?.cents}px)` }"
        )

        line(
          stroke="black"
          stroke-linecap="round"
          stroke-width="2"
          :y1="60"
          :y2="height * .3"
          )
        circle.filter.brightness-120(
          r="8"
          :fill="tuner.note.color"
          :cy="height * .3"
          )
        //- text(
        //-   style="user-select:none;transition:all 300ms ease; "
        //-   fill="currentColor"
        //-   font-size="12px"
        //-   :y="height * .25"
        //-   ) {{ tuner.note?.cents > 0 ? '+' : '' }}{{ tuner.note?.cents }}


      text(
        style="user-select:none;transition:all 300ms ease; "
        fill="currentColor"
        font-size="6rem"
        :y="height * 0.4"
        ) {{ tuner.note?.name }} {{ (tuner.note.value + 3) % 12 }}

      text.op-80(
        style="user-select:none;transition:all 300ms ease; "
        fill="currentColor"
        font-size="2rem"
        :y="height * 0.46"
        ) {{ tuner.note?.octave }}

      text.font-mono.op-70(
        style="user-select:none;transition:all 300ms ease; "
        fill="currentColor"
        font-size="2rem"
        text-anchor="end",

        :x="80"
        :y="height * 0.55"
        ) {{ tuner.note?.frequency.toFixed(2) }} Hz
      text.font-mono.op-50(
        style="user-select:none;transition:all 300ms ease; "
        fill="currentColor"
        font-size="2rem"
        text-anchor="end",
        :x="80"
        :y="height * 0.5"
        ) {{ tuner.note?.cents > 0 ? '+' : '' }}{{ tuner.note?.cents }}  cents
</template>

<style lang="postcss" scoped>
.meter {
  transition: transform 500ms ease;
}

stop {
  transition: all 600ms ease;
}
</style>