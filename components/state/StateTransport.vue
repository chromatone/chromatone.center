<script setup>
import { useTempo, tap } from "#/use/tempo";
import { useTuner } from "#/use/tuner";
const tempo = useTempo();
const { init, tuner } = useTuner();

const props = defineProps({
  secondary: Boolean,
});

function drag(event) {
  tempo.bpm += (event.delta[0] - event.delta[1]) / 16;
}

</script>
 
<template lang="pug">
.flex.flex-col.w-full.mx-auto.justify-center.gap-2
  .tempo-grid.text-xl
    button.relative.overflow-hidden(
      style="grid-area: CLICK", 
    :style="{ color: tempo.blink ? tempo.color : 'currentColor' }", @click="tempo.mute = !tempo.mute", aria-label="Toggle metronome", v-tooltip.top="'Toggle metronome'")
      .i-mdi-metronome.z-4(style="transition: all 300ms ease-out;", :transform="`scale(${!tempo.mute && tempo.blink ? 1.1 : 1})`", :style="{ opacity: tempo.mute ? 0.3 : 1 }").


      beat-move.opacity-30.z-2.absolute.top-0.bottom-0.w-full.h-full(:progress="tempo.progress", :color="tempo.color", :stroke="10")
    button(style="grid-area: PLAY", @click="tempo.playing = !tempo.playing", v-tooltip.top="'Play'")
      .i-la-play(v-if="!tempo.playing")
      .i-la-pause(v-else)
    button(style="grid-area: STOP", @click="tempo.stopped = Date.now()", v-tooltip.bottom="'Stop'")
      .i-la-stop
    button(style="grid-area: MINUS", @click="tempo.set(-1)", v-tooltip.bottom="'Subtract 1 BPM'")
      .i-la-minus
    button(style="grid-area: PLUS", @click="tempo.set(1)", v-tooltip.bottom="'Add 1 BPM'")
      .i-la-plus
    button(style="grid-area: DIVIDE", @click="tempo.set(-tempo.bpm / 2)", v-tooltip.top="'Half speed'")
      .i-la-slash
    button(style="grid-area: MULTIPLY", @click="tempo.set(tempo.bpm)", v-tooltip.top="'Double speed'")
      .i-la-times
    button.relative.touch-none.text-center.flex(style="grid-area: BPM", v-drag="drag", :class="{ active: tuner.blink }", :style="{ borderColor: tempo.blink ? tempo.color : 'currentColor' }")
      .font-bold.font-mono.flex-1.-mt-4.flex.justify-center.items-end(style="font-variant-numeric: tabular-nums")
        .text-4xl {{ tempo.bpm.toFixed(0) }}
        .m-0 {{ (tempo.bpm - Math.floor(tempo.bpm)).toFixed(1).substring(1) }}
      .text-sm.mt-1px.ml-1.absolute.bottom-3 BPM
    button.relative.flex.flex-col.gap-2.touch-none(v-drag="drag", style="grid-area: Hz", v-tooltip.top="'Tempo frequency and pitch class'", :style="{ color: tempo.color, borderColor: tempo.color }")
      .text-4xl.font-bold {{ tempo.note }}
      .flex-1.-mt-2.font-bold.font-mono {{ tempo.hz }}
      .text-sm.mt-1px.absolute.bottom-3 Hz
    control-knob.font-bold.w-full(style="grid-area: NOTE", v-model="tempo.volume", :min="0", :max="1", :step="0.01", param="VOL", :cc="16", v-tooltip.top="'Metronome volume'")
    button(style="grid-area: TAP", @mousedown.stop.prevent="tap()", @touchstart.stop.prevent="tap()", :class="{ active: tempo.tap.last }", v-tooltip.bottom="'Tap tempo'")
      .i-fluent-tap-double-20-regular.mt-1
    button(style="grid-area: TAPPED", v-tooltip.bottom="'Click to set tap tempo'", @click="tempo.tap.bpm && tempo.tap.last ? tempo.bpm = tempo.tap.bpm : tap()")
      .font-bold(v-if="tempo.tap.bpm && tempo.tap.last") {{ tempo.tap.bpm.toFixed(1) }}
      .opacity-40(v-else) TAP
    button(style="grid-area: GUESS", @click="!tuner.initiated ? init() : (tuner.listen = !tuner.listen)", v-tooltip.top="'Guess tempo from audio'")
      template(v-if="!tuner.listen")
        .i-tabler-ear
      template(v-else)
        .i-tabler-ear-off
    button.duration-100(style="grid-area: GUESSED", v-tooltip.top="'Click to set guessed tempo'", :class="{ active: tuner.blink }", @click="!tuner.initiated ? init() : tuner.listen && tuner.bpm ? tempo.bpm = tuner.bpm : tuner.listen = true")
      .font-bold(v-if="tuner.listen") {{ tuner.bpm.toFixed(0) }}
      .opacity-40(v-else) GUESS
  .flex.font-mono.text-sm.gap-4
    .flex-1 POS {{ tempo.position }}
    .flex-1 TICK {{ tempo.ticks }}
</template>

<style lang="postcss" scoped>
.active {
  @apply border-current;
}

.tempo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 2fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "CLICK DIVIDE MULTIPLY GUESSED GUESS"
    "PLAY BPM BPM Hz NOTE"
    "STOP MINUS PLUS TAPPED  TAP";
  align-items: stretch;
  justify-content: center;
  align-content: center;
  gap: 4px;
}

button {
  @apply justify-center flex items-center p-3 border-1 rounded-xl;
}
</style>
