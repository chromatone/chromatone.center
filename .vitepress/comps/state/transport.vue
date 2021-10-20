<template lang="pug">
.flex.flex-wrap.text-xl.w-full.mx-auto.justify-center
  .transport.flex.flex-wrap.is-group.m-1
    button.text-button(
      @click="tempo.playing = !tempo.playing"
    )
      la-play(v-if="!tempo.playing")
      la-pause(v-else)
    button.text-button(
      @click="tempo.stopped = true"
    )
      la-stop

  .info.flex.flex-wrap.items-center.cursor-pointer.select-none.text-center.is-group.m-1.transition-all.duration-50.ease-in(
    :style="{ borderColor: tempo.blink ? tempo.color : 'transparent' }"
    style="touch-action:none;cursor: hand;"
    v-drag="drag"
  )
    .text-button.w-8rem.flex.items-center
      .flex-1.text-center {{ tempo.bpm.toFixed(2) }} 
      .text-sm.mt-1px.ml-1 BPM
    .text-button.w-5rem.flex.items-center
      .flex-1 {{ tempo.hz }}  
      .text-sm.mt-1px Hz
    .text-button.w-3rem.font-bold(
      :style="{ color: tempo.color, borderColor: tempo.color }"
    ) {{ tempo.note }}

  .math.flex.flex-wrap.is-group.m-1
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

  .listap.flex.flex-wrap.is-group.m-1
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