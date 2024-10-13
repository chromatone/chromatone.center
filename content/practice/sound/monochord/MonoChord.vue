<script setup>
import { freqColor, freqPitch } from "#/use/calculations";
import { useTransition, TransitionPresets } from "@vueuse/core";
import { Frequency } from "tone";
import Fraction from "fraction.js";
import { computed, onMounted, reactive, ref } from "vue";
import { useClamp } from "@vueuse/math";
import { useString } from "#/use";

const {
  note: noteC,
  init: initC,
  controls,
  params,
  meter: volC,
} = useString("center");
const { note: noteL, init: initL, meter: volL } = useString("left");
const { note: noteR, init: initR, meter: volR } = useString("right");

const started = ref(false);

const strings = [noteC, noteL, noteR];

const freqs = computed(() => [fundamental.freq, part1.freq, part2.freq]);

const toMIDI = (freq) => 69 + 12 * Math.log2(freq / 440);

function play(string = 0, vel = 0.5) {
  Object.assign(strings[string], {
    number: toMIDI(freqs.value[string]).toFixed(4),
    velocity: vel,
  });
}

const state = reactive({
  ratio: useClamp(0.8, 0.05, 0.95),
  fraction: computed(() =>
    new Fraction(1 - state.ratio).simplify(0.001).toFraction(true)
  ),
  invFraction: computed(() =>
    new Fraction(state.ratio).simplify(0.001).toFraction(true)
  ),
});

const fundamental = reactive({
  freq: useClamp(220, 50, 2000),
  pitch: computed(() => freqPitch(fundamental.freq).toFixed()),
  note: computed(() => Frequency(fundamental.freq).toNote()),
  cents: computed(() =>
    calcCents(Frequency(fundamental.note).toFrequency(), fundamental.freq)
  ),
});

const part1 = reactive({
  freq: computed(() => fundamental.freq / (1 - state.ratio)),
  pitch: computed(() => (freqPitch(part1.freq) + 120) % 12),
  note: computed(() => Frequency(part1.freq).toNote()),
  cents: computed(() =>
    calcCents(Frequency(part1.note).toFrequency(), part1.freq)
  ),
});

const part2 = reactive({
  freq: computed(() => fundamental.freq / state.ratio),
  pitch: computed(() => (freqPitch(part2.freq) + 120) % 12),
  note: computed(() => Frequency(part2.freq).toNote()),
  cents: computed(() =>
    calcCents(Frequency(part2.note).toFrequency(), part2.freq)
  ),
});

const fractions = {
  "1/2": 1 / 2,
  "2/3": 2 / 3,
  "3/4": 3 / 4,
  "3/5": 3 / 5,
  "4/5": 4 / 5,
  "5/6": 5 / 6,
  "4/7": 4 / 7,
  "5/7": 5 / 7,
  "6/7": 6 / 7,
  "5/8": 5 / 8,
  "7/8": 7 / 8,
  "5/9": 5 / 9,
  "7/9": 7 / 9,
  "8/9": 8 / 9,
  "9/10": 9 / 10,
  "10/11": 10 / 11,
  "11/12": 11 / 12,
  "8/15": 8 / 15,
  "15/16": 15 / 16,
  "32/45": 32 / 45,
};

const ratio = useTransition(
  computed(() => state.ratio),
  {
    duration: 200,
    transition: TransitionPresets.easeOutCubic,
  }
);

function dragFun(drag) {
  fundamental.freq += drag.delta[0] / 4;
}

function changeRatio(drag) {
  state.ratio -= drag.delta[0] / 1200;
}

function calcCents(base, freq) {
  return (-(1200 / Math.log10(2)) * Math.log10(base / freq)) % 1200;
}
</script>

<template lang="pug">
button.p-40.text-2xl.font-bold.bg-light-900.dark-bg-dark-700.absolute.min-h-30.top-0.z-100.right-0.left-0(v-if="!started" @click="initC(); initL(); initR(); started = true") START 

.flex.flex-col.fullscreen-container#screen(v-else)
  svg.py-8.select-none.tocuh-action-none(
    version="1.1",
    baseProfile="full",
    :viewBox="`-10 -5 120 35`",
    xmlns="http://www.w3.org/2000/svg",
    font-family="Commissioner, sans-serif"
    font-size="3px"
    text-anchor="middle",
    dominant-baseline="middle"
    stroke-linecap="round"
    fill="white"
    )

    g#ruler(stroke-width="0.2" stroke="currentColor")
      line(y1="30" y2="30" x2="100")
      line(y1="0" y2="30")
      line(x1="100" x2="100" y1="0" y2="30")
      line(:x1="100 * (1 - ratio)" :x2="100 * (1 - ratio)" y1="0" y2="30")

      g#freqs(
        transform="translate(0 26)"
        stroke="none",
        fill="currentColor")
        g#left(text-anchor="start")
          text(
            :x="2" 
            ) {{ part1.freq.toFixed(1) }} Hz
          text(
            :x="2" 
            y="-4") {{ part1.note }} ({{ part1.cents.toFixed() }} cents) 
        g#right(text-anchor="end")
          text(:x="98") {{ part2.freq.toFixed(1) }} Hz
          text(:x="98" y="-4") {{ part2.note }} ({{ part2.cents.toFixed() }} cents) 

      g#ratio.cursor-pointer(
        v-drag="changeRatio" 
        transform="translate(0 18)"
        font-size="4px" 
        stroke-width="0"
        fill="currentColor")
        rect.cursor-grab(width="8" height="10" opacity="0.3" rx="2" :x="100 * (1 - ratio) - 4")
        g(
          @mousedown="play(0); play(1)"
          @pointerdown="play(0); play(1)"
          @pointercancel="play(0, 0); play(1, 0)"
          @pointerup="play(0, 0); play(1, 0)"
          @pointerout="play(0, 0); play(1, 0)"
          )
          text(:x="2" text-anchor="start") 
            tspan.font-bold(:fill="freqColor(part1.freq)") {{ state.fraction.split('/')[0] }}
            tspan /
            tspan.font-bold(:fill="freqColor(fundamental.freq)") {{ state.fraction.split('/')[1] }}
        g(
          @mousedown="play(0); play(2)"
          @pointerdown="play(0); play(2)"
          @pointercancel="play(0, 0); play(2, 0)"
          @pointerup="play(0, 0); play(2, 0)"
          @pointerout="play(0, 0); play(2, 0)"
          )
          text(:x="98" text-anchor="end") 
            tspan.font-bold(:fill="freqColor(part2.freq)") {{ state.invFraction.split('/')[0] }}
            tspan /
            tspan.font-bold(:fill="freqColor(fundamental.freq)") {{ state.invFraction.split('/')[1] }}

    //- MonoString

    g#fundamental.cursor-pointer(
      v-drag="dragFun" 
      @dblclick="fundamental.freq = 220"
      @pointerdown="play(0)"
      @pointerenter="play(0)"
      @pointerover="play(0)"
      @pointercancel="play(0, 0)"
      @pointerleave="play(0, 0)"
      @pointerout="play(0, 0)"
      )
      line(
        x2="100", 
        stroke-width="8", 
        :stroke="freqColor(fundamental.freq, 0.3 + 0.7 * volC)")
      circle(r="2")
      circle(cx="100", r="2")
      text(
        x="50" 
        font-weight="bold") {{ fundamental.note }}  {{ fundamental.freq.toFixed(2) }} Hz ({{ fundamental.cents.toFixed() }} cents)

    g#divided.cursor-pointer(
      v-drag="changeRatio" 
      transform="translate(0,10)" 
      font-weight="bold")
      g#part1(
        @pointerdown="play(1, 1)"
        @pointerenter="play(1, 1)"
        @pointerover="play(1, 1)"
        @pointercancel="play(1, 0)"
        @pointerleave="play(1, 0)"
        @pointerout="play(1, 0)"
        )
        line( 
          :stroke="freqColor(part1.freq, 0.3 + 0.7 * volL)" 
          stroke-width="8",
          :x2="100 * (1 - ratio)"
        )
        text(
          y="0.3", 
          :x="100 * (1 - ratio) / 2") {{ part1.note }}

      g#part2(
        @pointerdown="play(2, 1)"
        @pointerenter="play(2, 1)"
        @pointerover="play(2, 1)"
        @pointercancel="play(2, 0)"
        @pointerleave="play(2, 0)"
        @pointerout="play(2, 0)"
        )
        line( 
          :stroke="freqColor(part2.freq, 0.3 + 0.7 * volR)" 
          stroke-width="8",
          :x1="100 * (1 - ratio)"
          x2="100"
          )
        text(y="0.3", :x="100 - 100 * (ratio) / 2") {{ part2.note }}
        circle(:cx="100 * (1 - ratio)" r="2")
      circle(r="2")
      circle(r="2" cx="100")

  .flex.flex-wrap.justify-center.p-2
    button.text-button.flex-1(
      :class="{ active: fName == state.invFraction }"
      v-for="(frac, fName) in fractions" 
      :key="fName"
      @click="state.ratio = frac" ) {{ fName }}

</template>
