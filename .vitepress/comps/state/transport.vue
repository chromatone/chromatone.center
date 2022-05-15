<script setup>
import { useTempo, tap } from "@use/tempo.js";
import { useTuner } from "@use/tuner.js";
import { onKeyStroke } from "@vueuse/core";
const tempo = useTempo();
const { init, tuner } = useTuner();

onKeyStroke(" ", (e) => {
  e.preventDefault();
  tempo.playing = !tempo.playing;
});
onKeyStroke("Enter", (e) => {
  e.preventDefault();
  tempo.stopped = true;
});

function drag(event) {
  tempo.bpm += (event.delta[0] - event.delta[1]) / 16;
}
</script>

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

  .info.flex.flex-wrap.items-center.cursor-move.select-none.text-center.is-group.m-1.transition-all.duration-50.ease-in.touch-none(
    :style="{ borderColor: tempo.blink ? tempo.color : 'transparent' }"
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
      @click="tempo.set(-tempo.bpm / 2)"
      )
      la-slash
    button.text-button(
      @click="tempo.set(-1)"
      )
      la-minus
    button.text-button(
      @click="tempo.set(1)"
      )
      la-plus
    button.text-button(
      @click="tempo.set(tempo.bpm)"
      )
      la-times

  .listap.flex.flex-wrap.is-group.m-1
    button.text-button(
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
  
  slot.is-group.m-1.flex.items-center

</template>

<style lang="postcss" scoped>
.active {
  @apply border-current;
}
</style>
