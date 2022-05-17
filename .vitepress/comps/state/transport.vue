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
.flex.flex-col.w-full.mx-auto.justify-center.gap-2
  .tempo-grid.text-xl(v-drag="drag")
    button.CLICK.relative.overflow-hidden(
      :style="{ color: tempo.blink ? tempo.color : 'currentColor' }"
      @click="tempo.mute = !tempo.mute" 
      aria-label="Toggle metronome"

      ) 
      mdi-metronome.z-4(
        style="transition: all 300ms ease-out;"
        :transform="`scale(${!tempo.mute && tempo.blink ? 1.1 : 1})`"
        :style="{ opacity: tempo.mute ? 0.3 : 1 }"
        )
      beat-progress.opacity-30.z-2.absolute.top-0.bottom-0.w-full.h-full(:progress="tempo.progress" :color="tempo.color" :stroke="5")
    button.PLAY(@click="tempo.playing = !tempo.playing")
      la-play(v-if="!tempo.playing")
      la-pause(v-else)
    button.STOP(@click="tempo.stopped = true")
      la-stop


    button.DIVIDE(@click="tempo.set(-tempo.bpm / 2)")
      la-slash
    button.MINUS(@click="tempo.set(-1)")
      la-minus
    button.PLUS(@click="tempo.set(1)")
      la-plus
    button.MULTIPLY(@click="tempo.set(tempo.bpm)")
      la-times

    button.BPM.relative( 
      :class="{ active: tuner.blink }"
      :style="{ borderColor: tempo.blink ? tempo.color : 'currentColor' }"
      )
      .text-4xl.font-bold.flex-1.text-center.-mt-4 {{ tempo.bpm.toFixed(1) }} 
      .text-sm.mt-1px.ml-1.absolute.bottom-3 BPM
    button.Hz.relative
      .flex-1.-mt-4.font-bold {{ tempo.hz }}  
      .text-sm.mt-1px.absolute.bottom-3 Hz
    button.NOTE.font-bold(
      :style="{ color: tempo.color, borderColor: tempo.color }"
      ) {{ tempo.note }}


    button.TAP(
      @mousedown.stop.prevent="tap()"
      @touchstart.stop.prevent="tap()"
      :class="{ active: tempo.tap.last }"
      )
      fluent-tap-double-20-regular.mt-1
    button.TAPPED(
      @click="tempo.tap.bpm && tempo.tap.last ? tempo.bpm = tempo.tap.bpm : tap()") 
      .font-bold(v-if="tempo.tap.bpm && tempo.tap.last") {{ tempo.tap.bpm.toFixed(1) }}
      .opacity-40(v-else) TAP

    button.GUESS(@click="!tuner.initiated ? init() : (tuner.listen = !tuner.listen)" )
      template(v-if="!tuner.listen")
        tabler-ear
      template(v-else)
        tabler-ear-off
    button.GUESSED.duration-100(
      :class="{ active: tuner.blink }"
      @click="tuner.listen ? tempo.bpm = tuner.bpm : tuner.listen = true") 
      .font-bold(v-if="tuner.listen") {{ tuner.bpm.toFixed(0) }}
      .opacity-40(v-else) GUESS
  .flex.font-mono.text-sm.gap-4
    .flex-1 POS {{ tempo.position }}
    .flex-1 TICK {{ tempo.ticks }}
    .flex-1


</template>

<style lang="postcss" scoped>
.active {
  @apply border-current;
}

.tempo-grid {
  display: grid;
  grid-template-columns: 1fr 6fr 6fr 6fr 4fr;
  grid-template-rows: 1fr 2fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "CLICK PLUS MULTIPLY GUESSED GUESS"
    "PLAY BPM BPM Hz NOTE"
    "STOP MINUS DIVIDE TAPPED TAP";
  align-items: stretch;
  justify-content: center;
  align-content: center;
  gap: 4px;

  button {
    @apply justify-center flex items-center p-3 border-1 rounded-xl;
  }

  .PLAY {
    grid-area: PLAY;
  }

  .BPM {
    grid-area: BPM;
  }

  .Hz {
    grid-area: Hz;
  }

  .NOTE {
    grid-area: NOTE;
  }

  .STOP {
    grid-area: STOP;
  }

  .MINUS {
    grid-area: MINUS;
  }

  .DIVIDE {
    grid-area: DIVIDE;
  }

  .GUESS {
    grid-area: GUESS;
  }

  .GUESSE {
    grid-area: GUESSED;
  }

  .TAP {
    grid-area: TAP;
  }

  .TAPPED {
    grid-area: TAPPED;
  }

  .CLICK {
    grid-area: CLICK;
  }

  .MULTIPLY {
    grid-area: MULTIPLY;
  }

  .PLUS {
    grid-area: PLUS;
  }
}
</style>
