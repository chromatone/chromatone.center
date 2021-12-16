<template lang="pug">
.fullscreen-container.rounded-4xl#screen.p-4.mb-8
  full-screen.absolute.right-2.top-2
  svg.w-full.select-none(
    version="1.1",
    ref="svg"
    baseProfile="full",
    viewBox="-50 -50 1000 720",
    xmlns="http://www.w3.org/2000/svg",
    style="touch-action:none"
    @mousemove="mouse.getCursorPosition"
    @click="points.add()"
    )
    g(
      :opacity="started ? 1 : 0.1"
      :class="{ 'pointer-events-none': !started }"
    )
      g.y
        line(
          x1="0"
          x2="0"
          y1="0"
          y2="600"
          stroke-width="2"
          stroke="currentColor"
        )
        text(
          fill="currentColor"
          font-family="Commissioner, sans-serif"
          font-size="25px"
          text-anchor="middle"
          x="-30"
          y="240"
          transform-origin="-30 240"
          transform="rotate(-90)"
        ) Sound pressure
        g(
          v-for="mark in pressure.marks"
          :key="mark"
          :transform="`translate(0, ${-pressure.toNormY(mark) * 600})`"
        )
          line(
            opacity="0.2"
            stroke="currentColor"
            stroke-width="1"
            y1="600"
            y2="600"
            x1="-10"
            x2="900"
          )
          text(
            fill="currentColor"
            font-family="Commissioner, sans-serif"
            font-size="10px"
            text-anchor="left"
            x="-25"
            y="595"
          ) {{ mark }}
        g(
          :transform="`translate(0, ${mouse.y})`"
        )
          line(
            x1="-5"
            :x2="mouse.x"
            y1="0"
            y2="0"
            stroke="currentColor"
            stroke-width="1px"
            opacity="0.8"
          )
          text(
            fill="currentColor"
            font-family="Commissioner, sans-serif"
            font-size="22px"
            text-anchor="left"
            x="6"
            y="-12"
          ) {{ pressure.db.toFixed(0) }} db
      g.x
        line(
          x1="0"
          x2="900"
          y1="600"
          y2="600"
          stroke-width="2"
          stroke="currentColor"
        )
        text(
          fill="currentColor"
          font-family="Commissioner, sans-serif"
          font-size="25px"
          text-anchor="middle"
          x="450"
          y="650"
        ) Frequency
        g(
          v-for="(oct,o) in freq.Cs"
          :key="oct"
        )
          line(
            :x1="900 * freq.toNormX(oct)"
            :x2="900 * freq.toNormX(oct)"
            y1="0"
            :y2="600"
            stroke="hsla(90,50%,50%,1)"
            stroke-width="2"
            opacity="0.4"
          )
          text(
            fill="hsla(90,50%,50%,1)"
            :x="900 * freq.toNormX(oct) + 5"
            y="20"
          ) C{{ o }}
        g(
          v-for="(mark,i) in freq.marks"
          :key="mark"
        )
          line(
            :x1="900 * freq.toNormX(mark)"
            :x2="900 * freq.toNormX(mark)"
            y1="0"
            :y2="freq.nums.includes(mark) ? 620 : 600"
            stroke="currentColor"
            stroke-width="1"
            :opacity="freq.nums.includes(mark) ? 0.3 : 0.1"
          )
        text(
          v-for="num in freq.nums"
            fill="currentColor"
            font-family="Commissioner, sans-serif"
            font-size="12px"
            text-anchor="middle"
            :x="900 * freq.toNormX(num)"
            y="625"
          ) {{ num }} Hz
        g(
          :transform="`translate(${mouse.x}, 0)`"
        )
          line.transition-all.duration-100(
            x1="0"
            x2="0"
            :y1="mouse.y"
            y2="600"
            :stroke="freq.color"
            stroke-width="2px"
          )
          circle.transition-all.duration-100(
            cx="0"
            cy="600"
            r="6"
            :fill="freq.color"
          )
          text(
            fill="currentColor"
            font-family="Commissioner, sans-serif"
            font-size="22px"
            text-anchor="start"
            x="10"
            y="590"
          ) {{ freq.hz.toFixed(1) }} Hz
          text(
            fill="currentColor"
            font-family="Commissioner, sans-serif"
            font-size="22px"
            text-anchor="end"
            x="-10"
            y="590"
            :color="freq.color"
          ) {{ freq.note.name }} {{ freq.cents }}
      path(
        stroke="currentColor"
        stroke-width="1"
        fill="none"
        transform="scale(1.46) translate(-82,20)"
        d="M82.6,19.38l10.11,16,22,38.26,20.7,35.62c.09.16.18.31.28.46l19.74,29.17a5.39,5.39,0,0,0,.4.54l19.74,24.36,21.84,24.37,13.08,13.58.38.36,16.34,14.85,18.13,15.25.38.3,14.75,10.94c.13.1.28.2.42.29l14.68,9.46,18.19,11,18.43,10.1,18.18,9.47,14.79,6.83c.16.08.32.14.49.21L367.09,299l16.75,5.7.6.18L398,308.35l10.49,2.59.5.11,12.13,2.18.49.07,11.11,1.29a7.83,7.83,0,0,0,1.28,0l9.1-.43a8,8,0,0,0,1.94-.33l13.56-4.18a5.52,5.52,0,0,0,.53-.18l16.53-6.4a9.37,9.37,0,0,1,1-.31l10.53-2.49a8.3,8.3,0,0,1,1.4-.21l8-.42a8,8,0,0,1,1.77.11l5.71,1a7.77,7.77,0,0,1,2.57.93l8.44,4.85a7.5,7.5,0,0,1,.88.59l11.07,8.51,11,7.88c.19.14.38.26.58.38l5.94,3.52a7.35,7.35,0,0,0,1.2.58l2.9,1.11a7.31,7.31,0,0,0,1.59.42l1.06.17a7.91,7.91,0,0,0,4.19-.49l2.49-1a7.85,7.85,0,0,0,2.88-2l6.58-7.32c.11-.12.21-.24.31-.37l10.33-13c.17-.22.33-.44.48-.67l10.38-16.32L599,272c.12-.2.25-.39.39-.58l6-8.19a8,8,0,0,1,2-1.9l4.94-3.26a7.82,7.82,0,0,1,2.92-1.18l4.58-.84a8,8,0,0,1,2.84,0l2.29.42a7.89,7.89,0,0,1,4.23,2.27l5.54,5.72a7.3,7.3,0,0,1,1,1.19l8.2,12.64a7.52,7.52,0,0,0,1.11,1.35l1.92,1.87a7.87,7.87,0,0,0,5.68,2.24h0a7.93,7.93,0,0,0,3.93-1.16l3-1.82a7.87,7.87,0,0,0,2.35-2.21l6-8.59a7.84,7.84,0,0,0,1-2l5.5-16.27a7.38,7.38,0,0,0,.31-1.23l1.55-9.33a8.18,8.18,0,0,1,.33-1.27l6.35-18.44"
        )
      rect(
        style="cursor:none"
        ref="area"
        x=0
        y=0
        width="900"
        height="600"
        fill="hsla(0,0%,100%,0.1)"
      )
      g(
        :transform="`translate(${mouse.x}, ${mouse.y})`"
      )
        circle.pointer(
          :cx="0"
          :cy="0"
          r="16"
          :fill="freq.color"
        )
        text(
          font-weight="bold"
          fill="white"
          font-family="Commissioner, sans-serif"
          font-size="18px"
          text-anchor="middle"
          x="0"
          y="5"
          ) {{ freq.note.name }} 
      polyline(
        :points="points.line"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
        opacity="0.7"
      )
      g(
        v-for="(point,idx) in points.list"
        :key="point.hz"
        :transform="`translate(${point.x}, 0)`"
      )
        line(
          x1="0"
          x2="0"
          y1="600"
          :y2="point.y"
          :stroke="point.color"
          stroke-width="2"
        )
        circle.cursor-pointer(
          cx="0"
          :cy="point.y"
          r="20"
          :fill="point.color"
          @click.stop.prevent="points.remove(idx)"
        )
        text(
          fill="currentColor"
          font-family="Commissioner, sans-serif"
          font-size="16px"
          text-anchor="end"
          x="-5"
          :y="point.y + 36"
          ) {{ point.cents < 0 ? '' : '+' }}{{ point.cents }}
        text(
          fill="currentColor"
          font-family="Commissioner, sans-serif"
          font-size="16px"
          text-anchor="start"
          x="5"
          :y="point.y + 36"
          ) {{ point.hz.toFixed(1) }} Hz
        text(
          font-weight="bold"
          fill="white"
          font-family="Commissioner, sans-serif"
          font-size="22px"
          text-anchor="middle"
          x="0"
          :y="point.y + 8"
          ) {{ point.note }} 
      g.cursor-pointer(
        transform="translate(860,560)"
        @click.stop.prevent="points.clear()"
        v-if="points.list.length > 0"
      )
        circle(
          cx="14"
          cy="14"
          r="22"
          fill="gray"
        )
        la-trash.text-2xl
    g.cursor-pointer(
      v-if="!started"
      @click.stop.prevent="startApp()"
      )
      rect(
        x=250
        y=200
        width=400
        height=100
        rx=20
        fill="gray"
        stroke="white"
      )
      text(
        font-weight="bold"
        fill="white"
        font-family="Commissioner, sans-serif"
        font-size="42px"
        text-anchor="middle"
        x="450"
        y="265"
      ) START AUDIO
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { freqColor, freqPitch, notes, pitchFreq } from '@theory'
import { MonoSynth, start } from 'tone'

const started = ref(false)
function startApp() {
  start()
  started.value = true
}

import { useSvgMouse } from '@use/mouse.js'

const { svg, area, mouse } = useSvgMouse();


const freq = reactive({
  min: 10,
  max: 20000,
  marks: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 20000],
  nums: [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000],
  As: [22.5, 55, 110, 220, 440, 880, 1760, 3520, 7040, 14080],
  Cs: [16, 32, 65, 130.813, 261, 523, 1046, 2093, 4186, 8372, 16744],
  hz: computed(() => freq.toHz(mouse.normX)),
  color: computed(() => freqColor(freq.hz)),
  pitch: computed(() => (freqPitch(freq.hz) + 120) % 12),
  note: computed(() => {
    let note = Math.round(freq.pitch)
    if (note > 11.5) note = 0
    return notes[note]
  }),
  cents: computed(() => ((freq.pitch - freq.pitch.toFixed(0)) * 100).toFixed(0)),
  toNormX(hz) {
    return ((Math.log(hz) - Math.log(freq.min)) / (Math.log(freq.max) - Math.log(freq.min)))
  },
  toHz(pos) {
    return Math.pow(10, (pos * (Math.log10(freq.max) - Math.log10(freq.min)) + Math.log10(freq.min)))
  },
})

const pressure = reactive({
  min: -80,
  max: 10,
  marks: [-80, -70, -60, -50, -40, -30, -20, -10, 0, 10],
  db: computed(() => pressure.toDb(mouse.normY)),
  toDb(pos) {
    return (pressure.max - pressure.min) * pos + pressure.min
  },
  toNormY(db) {
    return (db - pressure.min) / (pressure.max - pressure.min)
  }
})



const points = reactive({
  list: [],
  add() {
    let hz = freq.toHz(mouse.normX)
    let synth = new MonoSynth({
      oscillator: {
        type: "sine"
      },
      volume: pressure.db
    }).toDestination()
    synth.triggerAttack(hz, mouse.normY)
    let pitch = (freqPitch(hz) + 120) % 12
    if (pitch > 11.5) pitch = 0
    let cents = ((pitch - pitch.toFixed(0)) * 100).toFixed(0)
    points.list.push({
      synth,
      x: mouse.x,
      y: mouse.y,
      hz,
      pitch,
      cents,
      note: notes?.[Math.round(pitch)]?.name,
      color: freqColor(hz),
    })
  },
  line: computed(() => {
    let line = []
    let list = [...points.list]
    list.sort((p1, p2) => p1.x < p2.x ? -1 : 1)
    list.forEach(p => {
      line.push([p.x, p.y].join(','))
    })
    return line.join(' ')
  }),
  clear() {
    points.list.forEach(point => {
      point.synth.triggerRelease()
    })
    points.list.splice(0, points.list.length)
  },
  remove(idx) {
    points.list?.[idx].synth.triggerRelease()
    points.list.splice(idx, 1)
  }
});

</script>

<style scoped>
.pointer {
  @apply transition-all duration-50 pointer-events-none;
}
text {
  @apply pointer-events-none select-none;
}
</style>