<template lang="pug">
.flex.flex-col.items-center.w-full.mt-8
  .flex.flex-col.items-center
    .flex.flex-wrap(
      v-for="(loop,i) in loops", 
      :key="loop"
    ) 
      .button(@click="loop.mute = !loop.mute")
        la-volume-off(v-if="loop.mute")
        la-volume-up(v-else)
      .button(@click="loop.over--")
        la-minus
      .info {{ loop.over }} / {{ loop.under }}
      .button(@click="loop.over++")
        la-plus
      .button(@click="loops.splice(i, 1)")
        la-times
    .flex(v-if="loops.length < 3")
      .info
        input.bg-transparent.w-3rem(
          inputmode="numeric"
          pattern="[0-9]*"
          type="number", 
          v-model="add.over"
          )
        span.ml-2 /
        input.bg-transparent.w-3rem(
          inputmode="numeric"
          pattern="[0-9]*"
          type="number", 
          v-model="add.under"
          )
      .button(@click="loops.push({ ...add })")
        la-plus

  svg#metronome.w-full.my-8.max-h-90vh(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 1000 1000",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none"
    )
    g.math(
      font-size="36"
      transform="translate(30,80)"
    )
      circle.transition-all.duration-100(
        cx="-10"
        cy="-10"
        r="4"
        :fill="tempo.blink ? 'currentColor' : 'transparent'"
      )
      text(
        fill="currentColor"
        ) {{ tempo.bpm.toFixed(2) }} BPM
      text(
        fill="currentColor"
        y="40"
        ) {{ tempo.hz }} Hz
      text(
        y="80"
        :fill="tempo.color"
      ) {{ tempo.note }}

    g.listen(
      transform="translate(20,880)"
      font-size="45"
      @click="!tuner.initiated ? init() : null"
    )
      g.ear(@click="tuner.listen = !tuner.listen")
        rect(
          width="70"
          height="80"
          stroke="currentColor"
          fill="transparent"
          rx="10"
          stroke-width="4"
        )
        g.icon(
          transform="translate(6,12)"
        )
          tabler-ear(v-if="!tuner.listen")
          tabler-ear-off(v-else)
      g.bpm.transition-all.duration-200.ease-out(
        @click="tempo.bpm = tuner.bpm"
        v-if="tuner.listen"
      )
        rect(
          x="80"
          width="100"
          height="80"
          rx="10"
          stroke-width="4"
          fill="transparent"
          :stroke="tuner.blink ? 'currentColor' : '#33333333'"
        )
        text(
          fill="currentColor"
          font-size="36"
          y="52"
          x="130"
          text-anchor="middle"
        ) {{ tuner.bpm.toFixed(1) }}
    g.tap.cursor-pointer(
      @mousedown.stop.prevent="tap()"
      @touchstart.stop.prevent="tap()"
      transform="translate(820,880)"
      )
      rect(
        width="140"
        height="80"
        rx="10"
        :stroke="tempo.tap.last ? 'currentColor' : '#33333333'"
        fill="transparent"
        stroke-width="4"
      )
      text(
        fill="currentColor"
        font-size="36"
        y="55"
        x="65"
        text-anchor="middle"
      ) TAP

    g.transport(
      transform="translate(800)"
    )
      g.play.cursor-pointer(
      transform="translate(0,50)"
      @click="tempo.playing = !tempo.playing"
      font-size="50"

      )
        rect(
          stroke="currentColor"
          fill="transparent"
          stroke-width="4"
          x="0"
          y="0"
          rx="10"
          width="60"
          height="60"
        )
        la-play(
          v-if="!tempo.playing"
        )
        la-pause(
          v-else
        )
      g.stop.cursor-pointer(
        transform="translate(80,50)"
        @click="tempo.stopped = true"
        font-size="50"

        )
          rect(
            stroke="currentColor"
            fill="transparent"
            stroke-width="4"
            x="0"
            y="0"
            rx="10"
            width="60"
            height="60"
          )
          la-stop
    metronome-circle-loop(
      v-for="(loop,i) in loops",
      :key="loop"
      :order="i"
      :loop="loop"
      :radius="400 - i * 125"
      @del="loops.splice(i, 1)"
    )
</template>

<script setup>
import { tempo, tap } from '@use/tempo.js'
import { useTuner } from '@use/tuner.js'

const { init, tuner } = useTuner();


const add = reactive({
  mute: false,
  over: 4,
  under: 4,
})

const loops = useStorage('tempo-loops', [
  {
    mute: false,
    over: 8,
    under: 8
  },
  {
    mute: false,
    over: 4,
    under: 4
  }]);
</script>

<style scoped>
.button {
  @apply p-2 border-1 m-1 cursor-pointer shadow-md rounded text-2xl;
}
.info {
  @apply p-2 rounded m-1 text-2xl flex items-center;
}

.active,
.measure.active {
  @apply bg-current transition-all duration-400;
}

.measure {
  background-color: hsla(0, 0%, 50%, 0.5);
}
</style>