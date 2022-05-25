<script setup>
import overtonesGuitar from './guitar.vue'

import { useStorage, useTimestamp } from '@vueuse/core'
import { pitchColor, freqColor, pitchFreq } from '@use/calculations'
import { Synth, start, Frequency } from "tone";
import { globalScale } from '@use/chroma'
import { createChannel } from '@use/audio'

const box = reactive({
  width: 150,
  height: 200,
  padX: 30,
  padY: 20,
  x: 0,
  y: 0,
  stroke: 'currentColor',
  fill: 'none',
  'stroke-width': 0.2
});

let sine = null
let saw = null
const sound = reactive({
  started: false,
  enabled: false,
  async init() {
    if (sound.started) {
      sound.enabled = !sound.enabled
      return
    }
    await start()
    sound.started = true
    sound.enabled = true

    const { channel } = createChannel('overtones')
    sine = new Synth({
      oscillator: {
        type: 'sine',
      },
      volume: -10,
      envelope: {
        attack: 0.1,
        decay: 0.01,
        sustain: 1,
        release: 4,
      },
    }).connect(channel)
    saw = new Synth({
      oscillator: {
        type: 'sawtooth8',
      },
      volume: -10,
      envelope: {
        attack: 0.1,
        decay: 0.01,
        sustain: 1,
        release: 4,
      },
    }).connect(channel)
  },
  playSaw(note) {
    if (!sound.enabled) {
      sound.init()
      return null
    }
    saw.triggerAttack(note)
  },
  stopSaw() {
    if (!sound.enabled) return
    saw.triggerRelease()
  },
  play(note, order, immediate) {
    if (!sound.enabled) {
      sound.init()
      return null
    }
    saw.volume.rampTo(-10 - 100 * order, 0.01)
    sine.triggerAttack(note, '+0.1', (overtones.count - order) / overtones.count)
  },
  stop() {
    if (!sound.enabled) return
    sine.triggerRelease()
  },
  change(note, order) {
    if (!sound.enabled) return
    saw.volume.rampTo(-10 - 100 * order, 0.01)
    sine.setNote(note)
  }
})

const { timestamp, pause, resume } = useTimestamp({ controls: true, offset: -Date.now() })

const time = reactive({
  phase: computed(() => {
    return time.speed * (timestamp.value / 100) % 100 / 100
  }),
  speed: 1,
  move: true,
})

watch(() => time.move, move => {
  if (move) { resume() } else { pause() }
}, { immediate: true })

const fundamental = reactive({
  pitch: 0,
  octave: useStorage('overtones-octave', 2),
  frequency: computed(() => pitchFreq(globalScale.tonic, fundamental.octave)),
  points: computed(() => {
    let points = []
    for (let pos = 0; pos <= box.width; pos += 1) {
      let sum = 0
      for (let partial = 0; partial <= overtones.count; partial++) {
        sum = sum + calcWave(partial, pos, time.phase) / (Math.exp(partial / 2 + 1))
      }
      let y = box.height / (3 * overtones.count) * sum * 5
      points[pos] = `${pos},${y}`
    }
    return points.join(' ')
  }),
  stroke: computed(() => freqColor(fundamental.frequency)),
  note: computed(() => {
    return Frequency(fundamental.frequency).toNote()
  }),
  cents: computed(() => {
    return calcCents(fundamental.frequency, Frequency(fundamental.note).toFrequency())
  }),
});

const overtones = reactive({
  count: useStorage('overtones-count', 7),
  min: 2,
  max: 15,
  list: [],
  intervals: ['P8', 'P8+P5', '2P8', '2P8+M3', '2P8+P5', '2P8+m7', '3P8', '3P8+M2', '3P8+M3', '3P8+TT', '3P8+P5', '3P8+n6', '3P8+P5+m3', '3P8+M7', '4P8']
})

watch(() => overtones.count, count => {
  overtones.list = []
  for (let i = 1; i <= count; i++) {
    overtones.list[i - 1] = {
      frequency: computed(() => {
        return fundamental.frequency * (i + 1)
      }),
      note: computed(() => {
        let freq = overtones.list[i - 1].frequency
        return Frequency(freq).toNote()
      }),
      cents: computed(() => {
        return calcCents(fundamental.frequency, overtones.list[i - 1].frequency).toFixed(0)
      }),
      centDiff: computed(() => {
        return overtones.list[i - 1].cents - Math.round(overtones.list[i - 1].cents / 100) * 100
      }),
      position: computed(() => {
        return i * (box.height - box.padY) / (overtones.count)
      }),
      stroke: computed(() => {
        return freqColor(overtones.list[i - 1].frequency)
      }),
      amplitude: computed(() => {
        return box.height / (3 * count * i / 2)
      }),
      points: computed(() => {
        let points = []
        for (let pos = 0; pos <= box.width; pos += 1) {
          let y = overtones.list[i - 1].amplitude * calcWave(i, pos, time.phase)
          points[pos] = `${pos},${y}`
        }
        return points.join(' ')
      }),
      dots: computed(() => {
        let dots = []
        for (let pos = 0; pos <= i; pos++) {
          dots.push(box.width / i * pos)
        }
        return dots
      })
    }
  }
}, { immediate: true })

function calcWave(num, x, time) {
  return Math.sin(Math.PI * num * x / box.width) * Math.cos(time * num * 2 * Math.PI)
}

function calcSine(num, x, phase = 0) {
  return Math.sin(Math.PI * 2 * phase + num / 2 * x / box.width * 2 * Math.PI)
}

function calcCents(base, freq) {
  return -(1200 / Math.log10(2)) * (Math.log10(base / freq)) % 1200
}
</script>

<style lang="postcss" scoped>
svg {
  touch-action: none;
  user-select: none;
}
</style>
  
<template lang="pug">
.flex.flex-col.fullscreen-container.rounded-4xl#screen
  .controls.flex.flex-wrap.justify-center.-mb-8.z-2.mt-8
    .is-group.flex.items-center.mr-2.gap-2
      button.shadow.p-3.m-1.border-1.border-current.rounded(
        @click="time.move = !time.move"
        v-tooltip.bottom="'Toggle animation'"
      )
        la-play(v-if="!time.move")
        la-pause(v-if="time.move")
      control-rotary(
        v-tooltip.bottom="'Number of harmonics'"
        :min="overtones.min"
        :max="overtones.max"
        :step="1"
        :fixed="0"
        param="count"
        v-model="overtones.count"
        )
      control-rotary(
        v-tooltip.bottom="'Speed of animation'"
        :min="0.2"
        :max="2"
        :step="0.1"
        :fixed="1"
        param="speed"
        v-model="time.speed"
        )

    .is-group.flex.items-center.gap-2
      control-piano(v-model:pitch="globalScale.tonic" v-tooltip.bottom="'Fundamental pitch'")
      control-rotary(
        :min="1"
        :max="5"
        :step="1"
        :fixed="0"
        param="octave"
        v-tooltip.bottom="'Octave of the fundamental pitch'"
        v-model="fundamental.octave"
        )
    .is-group.flex.items-center.ml-2.p-2
      full-screen
  .relative.flex.flex-col.items-center
    button.shadow.p-3.m-1.border-1.border-current.rounded.absolute.top-80(
      @click="sound.init()"
      v-if="!sound.enabled"
    )
      bi-volume-up
  svg#overtones.w-full.max-h-90vh(
    version="1.1"
    baseProfile="full"
    :viewBox="`${-box.padX} ${-2 * box.padY} ${box.width + 2 * box.padX} ${box.height + 4 * box.padY}`"
    xmlns="http://www.w3.org/2000/svg"
    font-family="Commissioner, sans-serif"
    @mouseleave="sound.stop()"
    )
    overtones-guitar(
      :length="box.width"
      :transform="`translate(0,${box.height}) rotate(180) translate(-150, -12)`"
    )
    g#edges
      line(
        x1="0"
        x2="0"
        y1="0"
        :y2="box.height"
        stroke="gray"
        stroke-width="0.2"
      )
      line(
        :x1="box.width"
        :x2="box.width"
        y1="0"
        :y2="box.height"
        stroke="gray"
        stroke-width="0.2"
      )
    g#fundamental.cursor-pointer(
      @mouseover="fundamental.hover = true"
      @mouseleave="fundamental.hover = false; sound.stopSaw()"
      @mousedown="sound.playSaw(fundamental.frequency, true)"
      @touchstart="sound.playSaw(fundamental.frequency, true)"
      @mouseup="sound.stopSaw()"
      @touchend="sound.stopSaw()"
      @touchcancel="sound.stopSaw()"
      )
      rect.transition-all.duration-200(
        x="0"
        :y="-0.5 * (box.height - box.padY) / (overtones.count)"
        :width="box.width"
        :height="(box.height - box.padY) / (overtones.count)"
        :fill="fundamental.stroke"
        :opacity="fundamental.hover ? 0.2 : 0.05"
      )
      polyline(
        fill="none"
        v-bind="fundamental"
        :stroke-width="fundamental.hover ? 2 : 1"
      )
      circle(
        cx="0"
        cy="0"
        r="1"
        :fill="fundamental.stroke"
      )
      circle(
        :cx="box.width"
        cy="0"
        r="1"
        :fill="fundamental.stroke"
      )
      text(
        fill="currentColor"
        :x="-2"
        text-anchor="end"
        y="2"
        font-size="4px"
        ) {{ fundamental.frequency.toFixed(1) }} Hz 
      text(
        fill="currentColor"
        :x="box.width + 2"
        text-anchor="start"
        y="2"
        font-size="4px"
        ) {{ fundamental.note }} ({{ fundamental.cents.toFixed(0) }} cents)
    g.overtone.cursor-pointer(
      v-for="(overtone, i) in overtones.list"
      :key="overtone"
      :data-num="i + 1"
      :transform="`translate(0, ${overtone.position})`"
      @mouseenter="sound.change(overtone.frequency, i)"
      @mouseover="overtone.hover = true"
      @mouseleave="overtone.hover = false"
      @mousedown="sound.play(overtone.frequency, i); overtone.active = true"
      @touchstart="sound.play(overtone.frequency, i); overtone.active = true"
      @mouseup="sound.stop(); overtone.active = false"
      @touchend="sound.stop(); overtone.active = false"
      @touchcancel="sound.stop(); overtone.active = false"
      )
      rect.transition-all.duration-200(
        x="0"
        :y="-0.5 * (box.height - box.padY) / (overtones.count)"
        :width="box.width"
        :height="(box.height - box.padY) / (overtones.count)"
        :fill="overtone.stroke"
        :opacity="overtone.hover ? 0.2 : 0.05"
      )
      polyline.transition-all.duration-200(
        v-bind="overtone"
        fill="none"
        :stroke-width="overtone.hover ? overtone.active ? 2 : 1 : 0.5"
      )
      text(
        fill="currentColor"
        :x="-2"
        text-anchor="end"
        y="-3"
        font-size="4px"
        font-weight="bold"
      ) {{ i + 1 }}
      text(
        fill="currentColor"
        :x="-2"
        text-anchor="end"
        y="2"
        font-size="4px"
      ) {{ overtone.frequency.toFixed(1) }} Hz
      text(
        font-weight="bold"
        fill="currentColor"
        :x="box.width + 2"
        text-anchor="start"
        y="-3"
        font-size="4px"
      ) {{ overtones.intervals[i] }} 
      text(
        fill="currentColor"
        :x="box.width + 2"
        text-anchor="start"
        y="2"
        font-size="4px"
      ) {{ overtone.note }} ({{ overtone.centDiff > 0 ? '+' : '' }}{{ overtone.centDiff }} cents)
      circle.transition-all.duration-200(
        v-for="dot in overtone.dots"
        :key="dot"
        cy="0"
        :cx="dot"
        :r="overtone.hover ? 1.2 : 1"
        :fill="overtone.stroke"
      )

    g.lines(
      v-for="(overtone, i) in overtones.list"
      :key="i"
      )
      line(
        v-for="dot in overtone.dots"
        :key="dot"
        :x1="dot"
        :x2="dot"
        :y1="(i + 1) * (box.height - box.padY) / (overtones.count)"
        :y2="box.height + 12"
        :stroke="overtone.stroke"
        stroke-width="0.2"
        :opacity="1 - i / (overtones.count + 2)"
      )
</template>