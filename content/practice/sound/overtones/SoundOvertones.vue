<script setup>
import { useStorage, useTimestamp } from '@vueuse/core'
import { freqColor, pitchFreq } from '#/use/calculations'
import { Synth, start, Frequency } from "tone";
import { globalScale } from '#/use/global'
import { createAudioChannel } from '#/use/audio'
import { computed, reactive, watch } from 'vue';
import SoundOvertonesGuitar from './SoundOvertonesGuitar.vue';

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

// Define overtones first so we can use overtones.max in the audio init
const overtones = reactive({
  count: useStorage('overtones-count', 7),
  min: 1,
  max: 15,
  list: [],
  intervals: ['P1', 'P8', 'P8+P5', '2P8', '2P8+M3', '2P8+P5', '2P8+m7', '3P8', '3P8+M2', '3P8+M3', '3P8+TT', '3P8+P5', '3P8+n6', '3P8+m7', '3P8+M7', '4P8']
})

let sine = null
let sumSynths = []

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

    const { channel } = createAudioChannel('overtones')

    // Single synth for individual harmonic playback
    sine = new Synth({
      oscillator: { type: 'sine' },
      volume: -10,
      envelope: { attack: 0.1, decay: 0.01, sustain: 1, release: 4 },
    }).connect(channel)

    // Array of synths for the actual sum wave playback
    for (let i = 0; i <= overtones.max; i++) {
      sumSynths[i] = new Synth({
        oscillator: { type: 'sine' },
        volume: -Infinity, // Start muted
        envelope: { attack: 0.1, decay: 0.01, sustain: 1, release: 4 },
      }).connect(channel)
    }
  },
  playSum() {
    if (!sound.enabled) {
      sound.init()
      return null
    }
    // Trigger all currently displayed harmonics
    for (let i = 1; i <= overtones.count; i++) {
      const freq = fundamental.frequency * i
      // Scale volume logarithmically to match visual amplitude (1/i)
      const vol = -10 - 20 * Math.log10(i)
      sumSynths[i].volume.rampTo(vol, 0.01)
      sumSynths[i].triggerAttack(freq, '+0.05')
    }
  },
  stopSum() {
    if (!sound.enabled) return
    for (let i = 1; i <= overtones.count; i++) {
      sumSynths[i].triggerRelease()
    }
  },
  play(note, order) {
    if (!sound.enabled) {
      sound.init()
      return null
    }
    const harmonicNum = order + 1
    const vol = - 10 * Math.log10(harmonicNum)
    sine.volume.rampTo(vol, 0.01)
    sine.triggerAttack(note, '+0.1')
  },
  stop() {
    if (!sound.enabled) return
    sine.triggerRelease()
  },
  change(note, order) {
    if (!sound.enabled) return
    const harmonicNum = order + 1
    const vol = -10 - 20 * Math.log10(harmonicNum)
    sine.volume.rampTo(vol, 0.01)
    sine.setNote(note)
  }
})

const { timestamp, pause, resume } = useTimestamp({ controls: true, offset: -Date.now() })

const time = reactive({
  phase: computed(() => (time.speed * (timestamp.value / 100) % 100) / 100),
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
  position: computed(() => {
    const totalRows = overtones.count + 1
    const rowHeight = (box.height - box.padY) / totalRows
    return box.height - 0.5 * rowHeight
  }),
  points: computed(() => {
    const totalRows = overtones.count + 1
    const rowHeight = (box.height - box.padY) / totalRows
    let points = []
    for (let pos = 0; pos <= box.width; pos += 1) {
      let sum = 0
      // EXACT geometric sum of the currently displayed individual waves
      for (let partial = 1; partial <= overtones.count; partial++) {
        const amp = rowHeight / (2 * partial)
        sum = sum + amp * calcWave(partial, pos, time.phase)
      }
      points[pos] = `${pos},${sum}`
    }
    return points.join(' ')
  }),
  stroke: computed(() => freqColor(fundamental.frequency)),
  note: computed(() => Frequency(fundamental.frequency).toNote()),
  cents: computed(() => calcCents(fundamental.frequency, Frequency(fundamental.note).toFrequency())),
});

watch(() => overtones.count, count => {
  overtones.list = []
  const totalRows = count + 1
  const rowHeight = (box.height - box.padY) / totalRows

  for (let i = 1; i <= count; i++) {
    const n = i
    overtones.list[i - 1] = {
      harmonicNumber: n,
      frequency: computed(() => fundamental.frequency * n),
      note: computed(() => Frequency(fundamental.frequency * n).toNote()),
      cents: computed(() => calcCents(fundamental.frequency, fundamental.frequency * n).toFixed(0)),
      centDiff: computed(() => {
        const c = calcCents(fundamental.frequency, fundamental.frequency * n)
        const nearestSemitone = Math.round(c / 100) * 100
        return parseFloat((c - nearestSemitone).toFixed(1))
      }),
      position: computed(() => box.height - (i + 0.5) * rowHeight),
      stroke: computed(() => freqColor(fundamental.frequency * n)),
      amplitude: computed(() => rowHeight / (2 * n)),
      points: computed(() => {
        const amp = rowHeight / (2 * n)
        let pts = []
        for (let pos = 0; pos <= box.width; pos += 1) {
          pts.push(`${pos},${amp * calcWave(n, pos, time.phase)}`)
        }
        return pts.join(' ')
      }),
      dots: computed(() => {
        let d = []
        for (let pos = 0; pos <= n; pos++) {
          d.push(box.width / n * pos)
        }
        return d
      })
    }
  }
}, { immediate: true })

function calcWave(num, x, time) {
  return Math.sin(Math.PI * num * x / box.width) * Math.cos(time * num * 2 * Math.PI)
}

function calcCents(base, freq) {
  return -(1200 / Math.log10(2)) * (Math.log10(base / freq)) % 1200
}
</script>

<template lang="pug">
.flex.flex-col.fullscreen-container#screen
  svg#overtones.w-full.max-h-90vh(
    version="1.1"
    baseProfile="full"
    :viewBox="`${-box.padX} ${-0.5 * box.padY} ${box.width + 2 * box.padX} ${box.height + 3 * box.padY}`"
    xmlns="http://www.w3.org/2000/svg"
    font-family="Commissioner, sans-serif"
    @mouseleave="sound.stopSum()"
  )
    sound-overtones-guitar(
      :length="box.width"
      :transform="`translate(0, ${box.height - 12})`"
    )

    g#edges
      line(x1="0" x2="0" :y1="box.padY" :y2="box.height - 8" stroke="gray" stroke-width="0.2")
      line(:x1="box.width" :x2="box.width" :y1="box.padY" :y2="box.height - 8" stroke="gray" stroke-width="0.2")

    // SUM WAVE (Bottom Row) - Now plays the actual sum of sines!
    g#fundamental.cursor-pointer(
      :transform="`translate(0, ${fundamental.position})`"
      @mouseover="fundamental.hover = true"
      @mouseleave="fundamental.hover = false; sound.stopSum()"
      @mousedown="sound.playSum()"
      @touchstart="sound.playSum()"
      @mouseup="sound.stopSum()"
      @touchend="sound.stopSum()"
      @touchcancel="sound.stopSum()"
    )
      rect.transition-all.duration-200(
        x="0"
        :y="-0.5 * ((box.height - box.padY) / (overtones.count + 1))"
        :width="box.width"
        :height="(box.height - box.padY) / (overtones.count + 1)"
        :fill="fundamental.stroke"
        :opacity="fundamental.hover ? 0.2 : 0.05"
      )
      polyline(fill="none" v-bind="fundamental" :stroke-width="fundamental.hover ? 2 : 1")
      circle(cx="0" cy="0" r="1" :fill="fundamental.stroke")
      circle(:cx="box.width" cy="0" r="1" :fill="fundamental.stroke")

      text(fill="currentColor" :x="-2" text-anchor="end" y="-3" font-size="4px" font-weight="bold") Sum
      text(fill="currentColor" :x="-2" text-anchor="end" y="2" font-size="4px") {{ fundamental.frequency.toFixed(1) }} Hz 
      text(font-weight="bold" fill="currentColor" :x="box.width + 2" text-anchor="start" y="-3" font-size="4px") Sum
      text(fill="currentColor" :x="box.width + 2" text-anchor="start" y="2" font-size="4px") {{ fundamental.note }} ({{ fundamental.cents.toFixed(0) }} cents)

    // INDIVIDUAL HARMONICS (Ascending Rows)
    g.overtone.cursor-pointer(
      v-for="(overtone, i) in overtones.list"
      :key="i"
      :data-num="overtone.harmonicNumber"
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
        :y="-0.5 * ((box.height - box.padY) / (overtones.count + 1))"
        :width="box.width"
        :height="(box.height - box.padY) / (overtones.count + 1)"
        :fill="overtone.stroke"
        :opacity="overtone.hover ? 0.2 : 0.05"
      )
      polyline.transition-all.duration-200(
        v-bind="overtone"
        fill="none"
        :stroke-width="overtone.hover ? overtone.active ? 2 : 1 : 0.5"
      )

      text(fill="currentColor" :x="-2" text-anchor="end" y="-3" font-size="4px" font-weight="bold") {{ overtone.harmonicNumber }}
      text(fill="currentColor" :x="-2" text-anchor="end" y="2" font-size="4px") {{ overtone.frequency.toFixed(1) }} Hz
      text(font-weight="bold" fill="currentColor" :x="box.width + 2" text-anchor="start" y="-3" font-size="4px") {{ overtones.intervals[overtone.harmonicNumber - 1] }} 
      text(fill="currentColor" :x="box.width + 2" text-anchor="start" y="2" font-size="4px") {{ overtone.note }} ({{ overtone.centDiff > 0 ? '+' : '' }}{{ overtone.centDiff }} cents)

      circle.transition-all.duration-200(
        v-for="dot in overtone.dots"
        :key="dot"
        cy="0"
        :cx="dot"
        :r="overtone.hover ? 1.2 : 1"
        :fill="overtone.stroke"
      )

    // Vertical Node Lines
    g.lines(
      v-for="(overtone, i) in overtones.list"
      :key="i"
    )
      line(
        v-for="dot in overtone.dots"
        :key="dot"
        :x1="dot"
        :x2="dot"
        :y1="overtone.position"
        :y2="200"
        :stroke="overtone.stroke"
        stroke-width="0.2"
        :opacity="1 - i / (overtones.count + 2)"
      )

  .controls.flex.flex-wrap.justify-center.mb-8.z-2.-mt-2
    .is-group.flex.items-center.mr-2.gap-2
      button.shadow.p-3.m-1.border-1.border-current.rounded(
        v-tooltip.bottom="'Toggle animation'"
        @click="time.move = !time.move"
      )
        .i-la-play(v-if="!time.move")
        .i-la-pause(v-if="time.move")
      control-rotary(
        v-model="overtones.count"
        v-tooltip.bottom="'Number of harmonics'"
        :min="overtones.min"
        :max="overtones.max"
        :step="1"
        :fixed="0"
        param="count"
      )
      control-rotary(
        v-model="time.speed"
        v-tooltip.bottom="'Speed of animation'"
        :min="0.2"
        :max="2"
        :step="0.1"
        :fixed="1"
        param="speed"
      )

    .is-group.flex.items-center.gap-2
      control-piano(
        v-model:pitch="globalScale.tonic" 
        v-tooltip.bottom="'Fundamental pitch'")
      control-rotary(
        v-model="fundamental.octave"
        v-tooltip.bottom="'Octave of the fundamental pitch'"
        :min="1"
        :max="5"
        :step="1"
        :fixed="0"
        param="octave"
      )

  .relative.flex.flex-col.items-center
    button.shadow.p-3.m-1.border-1.border-current.rounded.absolute.top-80(
      v-if="!sound.enabled"
      @click="sound.init()"
    )
      .i-bi-volume-up
</template>

<style lang="postcss" scoped>
svg {
  touch-action: none;
  user-select: none;
}
</style>