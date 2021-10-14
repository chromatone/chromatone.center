<template lang="pug">
.flex.flex-wrap.text-3xl.w-full.max-w-55ch.mx-auto
  .transport.flex.flex-wrap
    button.text-button(
      @click="tempo.playing = !tempo.playing"
    )
      la-play(v-if="!tempo.playing")
      la-pause(v-else)
    button.text-button(
      @click="tempo.stopped = true"
    )
      la-stop
  .info.flex.flex-wrap.cursor-pointer.select-none.text-center(
    v-drag="drag"
  )
    .text-button.w-7em {{ tempo.bpm.toFixed(2) }} BPM
    .text-button.w-5em {{ tempo.hz }} Hz
    .text-button.w-3em.font-bold(
      :style="{ color: tempo.color }"
    ) {{ tempo.note }}
  .math.flex.flex-wrap
    button.text-button(
      @click="setTempo(-tempo.bpm / 2)"
    )
      la-slash
    button.text-button(
      @click="setTempo(-1)"
    )
      la-minus
    button.text-button(
      @click="setTempo(1)"
    )
      la-plus
    button.text-button(
      @click="setTempo(tempo.bpm)"
    )
      la-times
    .listap.flex.flex-wrap
      button.text-button.flex(
        @mousedown.stop.prevent="tap()"
        @touchstart.stop.prevent="tap()"
        :class="{ active: tempo.tap.last }"
      )
        fluent-tap-double-20-regular.mt-1
      button.text-button(
        v-if="tempo.tap.bpm && tempo.tap.last"
          @click="tempo.bpm = tempo.tap.bpm"
        ) {{ tempo.tap.bpm.toFixed(1) }}
      button.text-button(@click="!tuner.initiated ? init() : (tuner.listen = !tuner.listen)")
        tabler-ear(v-if="!tuner.listen")
        tabler-ear-off(v-else)
      button.text-button.duration-100(
        :class="{ active: tuner.blink }"
        @click="tempo.bpm = tuner.bpm"
        v-if="tuner.listen") {{ tuner.bpm.toFixed(1) }}
      full-screen

</template>

<script setup>
import { useTempo, tap } from '@use/tempo.js'
import { useTuner } from '@use/tuner.js'
import { onKeyStroke } from '@vueuse/core'
import { clampNum } from '@use/theory'
const tempo = useTempo();
const { init, tuner } = useTuner();


onKeyStroke(' ', (e) => {
  e.preventDefault()
  tempo.playing = !tempo.playing
});
onKeyStroke('Enter', (e) => {
  e.preventDefault()
  tempo.stopped = true
});

function drag(event) {
  tempo.bpm = clampNum(tempo.bpm, event.delta[0] / 16 - event.delta[1] / 16, 10, 500)
}


function setTempo(diff) {
  tempo.bpm = Math.round(clampNum(tempo.bpm, diff, 10, 500))
}

</script>

<style scoped>
.active {
  @apply border-current;
}
</style>