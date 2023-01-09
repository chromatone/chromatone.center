<script setup>
import { freqColor } from '#/use/calculations'
import { noteColor } from "#/use/colors";
import { useSvgMouse } from '#/use/mouse.js'
import { MonoSynth, gainToDb, Gain } from 'tone'
import { notes } from '#/use/theory'
import { createChannel } from '#/use/audio';

const box = {
  width: 1200,
  height: 600,
  padW: 100,
  padH: 100,
}

const cents = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
const intervals = ['1P', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8']
const fractions = ['1/1', '16/15', '9/8', '6/5', '5/4', '4/3', '45/32', '3/2', '8/5', '5/3', '9/5', '15/8', '2/1'];
const fracPos = fractions.map(fr => 1200 * Math.log2(fr.split('/')[0] / fr.split('/')[1]));

const { svg, area, mouse } = useSvgMouse();


const freq = reactive({
  main: 220,
  cents: computed(() => {
    return (mouse.normX * 1200)
  }),
  hz: computed(() => {
    return freq.main * Math.pow(2, freq.cents / 1200)
  }),
});

const synth = reactive({
  started: false,
  playing: false,
  osc: 'sawtooth8',
  oscs: ['sawtooth8', 'sine'],
  envelope: {
    attack: 0.2,
    decay: 0.2,
    sustain: 1,
    release: 1,
  },
  setOsc(osc) {
    synth.osc = osc
    synthOne.set({
      oscillator: {
        type: osc
      }
    });
    synthTwo.set({
      oscillator: {
        type: osc
      }
    })
  }
})

let synthOne, synthTwo

function initSynth() {
  if (!synth.started) {
    const channel = createChannel('dissonance')

    synthOne = new MonoSynth({
      oscillator: {
        type: synth.osc
      },
      filterEnvelope: synth.envelope,
      volume: 0
    }).connect(channel)
    synthTwo = new MonoSynth({
      oscillator: {
        type: synth.osc,
      },
      filterEnvelope: synth.envelope,
      volume: 0
    }).connect(channel)

    synth.started = true
  }
}

watch(() => mouse.normY, y => {
  if (!synthTwo) return
  synthTwo.volume.rampTo(gainToDb(y))
})


watch([() => freq.hz, () => mouse.pressed], (hz) => {
  if (!synth.started) return
  if (mouse.pressed) {
    if (!synth.playing && mouse.inside) {
      synth.playing = true
      synthOne.triggerAttack(freq.main)
      synthTwo.triggerAttack(freq.hz)
    } else {
      synthTwo.frequency.rampTo(freq.hz)
    }
  } else {
    synth.playing = false
    synthOne.triggerRelease()
    synthTwo.triggerRelease()
  }
});

</script>

<template lang="pug">
.fullscreen-container#screen.rounded-3xl
  full-screen.absolute.top-2.right-2
  svg#dissonance.w-full.my-20.select-none(
    version="1.1",
    baseProfile="full",
    :viewBox="`${-box.padW} ${-box.padH} ${box.width + 2 * box.padW} ${box.height + box.padH}`",
    xmlns="http://www.w3.org/2000/svg",
    @mousemove="mouse.getCursorPosition"
    ref="svg"
    style="touch-action:none"
    )
    defs
      linearGradient#intervalGradient
        stop(offset="0%" :stop-color="freqColor(freq.main)")
        stop(offset="100%" :stop-color="freqColor(freq.hz)")
    g.cursor-pointer(
      v-for="(fr, f) in [220, 440]"
      :key="fr"
      @click="freq.main = fr"
      :transform="`translate(${10 + f * 140},0)`"
      )
      rect(
        x="0"
        y="-70"
        width="130"
        height="60"
        fill="currentColor"
        opacity="0.1"
        ry="20"
        :opacity="freq.main == fr ? 0.3 : 0.1"
      )
      text(
        :font-weight="freq.main == fr ? 'bold' : 'normal'"
        fill="currentColor"
        font-family="Commissioner, sans-serif"
        font-size="32px"
        text-anchor="start"
        x="15"
        y="-30"

      ) {{ fr }} hz
    text(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="32px"
      text-anchor="middle"
      x="600"
      y="-30"
    ) Sensory dissonance curve
    g.cursor-pointer(
      v-for="(osc, o) in synth.oscs"
      :key="osc"
      @click="synth.setOsc(osc)"
      :transform="`translate(${870 + o * 240},0)`"
      )
      rect(
        x="0"
        y="-70"
        :width="osc.length * 26"
        height="60"
        fill="currentColor"
        opacity="0.1"
        ry="20"
        :opacity="synth.osc == osc ? 0.3 : 0.1"
      )
      text(
        :font-weight="synth.osc == osc ? 'bold' : 'normal'"
        fill="currentColor"
        font-family="Commissioner, sans-serif"
        font-size="32px"
        text-anchor="start"
        x="15"
        y="-30"

      ) {{ osc.toUpperCase() }}
    rect(
      ref="area"
      x="0"
      y="0"
      width="1200"
      height="500"
      fill="none"
      stroke="currentColor"
      stroke-width="1px"
      opacity="0.5"
    )
    text(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="25px"
      text-anchor="middle"
      x="-20"
      y="250"
      transform-origin="-20 250"
      transform="rotate(-90)"
    ) Dissonance
    line(
      x1="0"
      x2="0"
      y1="0"
      y2="500"
      :stroke="freqColor(freq.main)"
      :stroke-width="synth.playing ? 10 : 1"
    )
    text(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="25px"
      text-anchor="middle"
      x="600"
      y="570"
    ) Frequency ratio (cents)
    g(
      v-for="(cent, c) in cents"
      :key="cent"
      :transform="`translate(${cent},0)`"

    )
      line(
        stroke="currentColor"
        :x1="0"
        :x2="0"
        :y1="0"
        :y2="530"
        stroke-width="1"
      )
      text(
        fill="currentColor"
        font-family="Commissioner, sans-serif"
        font-size="18px"
        text-anchor="end"
        x="-5"
        y="520"
      ) {{ notes[c % 12] }}
      text(
        fill="currentColor"
        font-family="Commissioner, sans-serif"
        font-size="18px"
        text-anchor="start"
        x="5"
        y="520"
      ) {{ cent }}
    path(
      v-if="synth.osc == 'sawtooth8'"
      fill="none", 
      stroke="currentColor", 
      stroke-width="3", 
      stroke-linecap="round", 
      stroke-linejoin="round", 
      stroke-miterlimit="10", 
      d="M0,504.9c22.4-726,93.2-320.8,159.7-254.2c43.1,43.1,63.7,39.9,77.7,48.1c19.7,11.5,27.7,49.8,27.7,49.8c11.4-48.9,35-50,49.8,0.8c18-74.6,51.2-50.4,70.3,21.3c28.9-86.8,97.1-39.9,109.8,25.3c29.4-94.9,76.2-73.7,84.5-22.9c27.4-97.3,109.6-86.7,119.3,86.1c0,0,17.8-110.8,50.6-111.7c32.4-0.9,66.4,13.7,95.6,24.8c21.2,8,37.9,54.5,37.9,54.5s14.2-60.8,42.7-60.8c28.4,0,41.9,53.2,41.9,53.2c20.1-69.4,63.4-42,106.7-65c25.3-13.4,45.4-39.5,67.2-37.1c44.2,4.7,58.8,188,58.8,188"
      )
    path(
      v-if="synth.osc == 'sine'"
      fill="none", 
      stroke="currentColor", 
      stroke-width="3", 
      stroke-linecap="round", 
      stroke-linejoin="round", 
      stroke-miterlimit="10", 
      d="M0,504.9c22.4-726,123.3-349,177.8-272.3C380.1,517.5,953.4,500,1200,500"
      )
    g(
      v-for="(frac, idx) in fracPos"
      :key="frac"
      :transform="`translate(${frac} 0)`"

    )
      line(
        :stroke="noteColor(idx, 3)"
        opacity="1"
        stroke-width="1"
        x1="0"
        x2="0"
        y1="0"
        y2="500"
      )
      text(
        font-weight="bold"
        font-family="Commissioner, sans-serif"
        font-size="22px"
        text-anchor="start"
        :fill="noteColor(idx, 3)"
        x="5"
        y="25"
      ) {{ intervals[idx] }}
      text(
        font-family="Commissioner, sans-serif"
        font-size="22px"
        text-anchor="start"
        :fill="noteColor(idx, 3)"
        x="5"
        y="60"
      ) {{ fractions[idx] }}
    rect(
      v-if="synth.playing"
      x="0"
      y="0"
      :width="mouse.x"
      height="500"
      fill="url(#intervalGradient)"
      opacity="0.2"
    )
    g(
      :transform="`translate(${mouse.x}, 0)`"
    )
      line.pointer(
        x1="0"
        x2="0"
        y1="0"
        y2="500"
        :stroke-width="synth.playing ? 6 : 1"
        :stroke="freqColor(freq.hz)"
      )
      circle.pointer(
        :cx="0"
        :cy="0"
        :r="synth.playing ? 20 : 10"
        :fill="synth.playing ? freqColor(freq.hz) : 'currentColor'"
        :transform="`translate(0, ${mouse.y})`"
      )

      circle.pointer(
        :cx="0"
        :cy="500"
        r="8"
        :fill="synth.playing ? freqColor(freq.hz) : 'currentColor'"
      )
      text(
        font-family="Commissioner, sans-serif"
        font-size="22px"
        text-anchor="end"
        x="-20"
        fill="currentColor"
        y="490"
      ) {{ freq.hz.toFixed(0) }} hz
      text(
        font-family="Commissioner, sans-serif"
        font-size="22px"
        text-anchor="start"
        x="20"
        fill="currentColor"
        y="490"
      ) {{ freq.cents.toFixed(0) }}
    g.cursor-pointer(
    v-if="!synth.started"
    @click.stop.prevent="initSynth()"
    )
      rect(
        x=400
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
        x="600"
        y="265"
      ) START AUDIO
</template>

<style lang="postcss" scoped>
.pointer {
  @apply transition-all duration-100 pointer-events-none;
}

text {
  @apply pointer-events-none select-none;
}
</style>