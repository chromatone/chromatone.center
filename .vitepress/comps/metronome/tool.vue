<template lang="pug">
.flex.flex-col.items-center.w-full.mt-8
  svg#metronome.w-full.my-8.max-h-90vh(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 1000 1000",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
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

      transform="translate(820,880)"
      )
      g.finger(
        @mousedown.stop.prevent="tap()"
        @touchstart.stop.prevent="tap()"
      )
        rect(
          width="70"
          height="80"
          rx="10"
          :stroke="tempo.tap.last ? 'currentColor' : '#33333333'"
          fill="transparent"
          stroke-width="4"
        )
        fluent-tap-double-20-regular(
          font-size="55"
          transform="translate(2,8)"
          fill="currentColor"
          y="0"
          x="0"
          text-anchor="middle"
        )
      g.bpm.transition-all.duration-200.ease-out(
        @click="tempo.bpm = tempo.tap.bpm"
        v-if="tempo.tap.bpm"
      )
        rect(
          x="80"
          width="120"
          height="80"
          rx="10"
          stroke-width="4"
          fill="transparent"
          :stroke="tempo.tap.last ? 'currentColor' : '#33333333'"
        )
        text(
          fill="currentColor"
          font-size="36"
          y="52"
          x="140"
          text-anchor="middle"
        ) {{ tempo.tap.bpm.toFixed(1) }}
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
    metronome-loop(
      v-for="(loop,i) in loops",
      :key="loop.under"
      :order="i"
      :loop="loop"
      :radius="380 - i * 175"
      @del="loops.splice(i, 1)"
      @over="loop.over += $event"
      @under="loop.under += $event"
    )
</template>

<script setup>
import { tempo, tap } from '@use/tempo.js'
import { useTuner } from '@use/tuner.js'

const { init, tuner } = useTuner();


const add = reactive({
  over: 4,
  under: 4,
  volume: 1
})

const loops = useStorage('tempo-loops', [
  {
    over: 8,
    under: 8,
    volume: 1,
  },
  {
    over: 3,
    under: 3,
    volume: 0.5
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