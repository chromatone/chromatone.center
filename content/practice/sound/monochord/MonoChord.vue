<script setup>
import { freqColor, freqPitch } from "#/use/calculations";
import { useTransition, TransitionPresets } from "@vueuse/core";
import { Frequency } from "tone";
import Fraction from "fraction.js";
import { computed, reactive, ref } from "vue";
import { useClamp } from "@vueuse/math";
import { useString } from "#/use";

const { note: noteC, init: initC, meter: volC, } = useString("center");
const { note: noteL, init: initL, meter: volL } = useString("left");
const { note: noteR, init: initR, meter: volR } = useString("right");

const started = ref(false);

function start() {
  if (started.value) return
  initC(); initL(); initR(); started.value = true
}

const strings = [noteC, noteL, noteR];

const freqs = computed(() => [fundamental.freq, part1.freq, part2.freq]);

const toMIDI = (freq) => 69 + 12 * Math.log2(freq / 440);

function play(string = 0, vel = 0.5) {
  if (!started.value) return
  Object.assign(strings[string], {
    number: toMIDI(freqs.value[string]).toFixed(4),
    velocity: vel,
  });
}

const state = reactive({
  ratio: useClamp(0.66, 0.05, 0.95),
  fraction: computed(() =>
    new Fraction(state.ratio).simplify(0.001).toFraction(true)
  ),
  invFraction: computed(() =>
    new Fraction(1 - state.ratio).simplify(0.001).toFraction(true)
  ),
});

const fundamental = reactive({
  freq: useClamp(220, 27.5, 3520),
  pitch: computed(() => freqPitch(fundamental.freq).toFixed()),
  note: computed(() => Frequency(fundamental.freq).toNote()),
  cents: computed(() =>
    calcCents(Frequency(fundamental.note).toFrequency(), fundamental.freq)
  ),
});

const part1 = reactive({
  freq: computed(() => fundamental.freq / (state.ratio)),
  pitch: computed(() => (freqPitch(part1.freq) + 120) % 12),
  note: computed(() => Frequency(part1.freq).toNote()),
  cents: computed(() =>
    calcCents(Frequency(part1.note).toFrequency(), part1.freq)
  ),
});

const part2 = reactive({
  freq: computed(() => fundamental.freq / (1 - state.ratio)),
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
  const delta = drag.wheeling ? -drag.delta[0] / 32 : drag.delta[0] / 4
  fundamental.freq += delta
}

function changeRatio(drag) {
  const delta = drag.wheeling ? -drag.delta[0] / 4800 : drag.delta[0] / 1200
  state.ratio += delta
}

function calcCents(base, freq) {
  return (-(1200 / Math.log10(2)) * Math.log10(base / freq)) % 1200;
}
</script>

<template lang="pug">
.flex.flex-col.fullscreen-container.select-none#screen
  button.p-40.text-2xl.font-bold.bg-light-900.dark-bg-dark-700.absolute.min-h-30.top-0.z-100.right-0.left-0.w-full.bg-op-30.dark-bg-op-30.backdrop-blur(v-if="!started" @pointerdown="start()") START 
  svg.py-8.select-none.touch-action-none.select-none(
    v-else
    style="-webkit-overflow-scrolling: touch;"
    version="1.1",
    baseProfile="full",
    :viewBox="`-10 -5 120 31`",
    xmlns="http://www.w3.org/2000/svg",
    font-family="Commissioner, sans-serif"
    font-size="3px"
    text-anchor="middle",
    dominant-baseline="middle"
    stroke-linecap="round"
    fill="white"
    )

    g#ratio.cursor-pointer(
      transform="translate(0 10)"
      font-size="4px" 
      stroke-width="0"
      fill="currentColor" )

      g#intervalL.touch-manipulation(
        @pointerdown="play(0); play(1)"
        @pointercancel="play(0, 0); play(1, 0)"
        @pointerup="play(0, 0); play(1, 0)"
        @pointerout="play(0, 0); play(1, 0)"
        v-wheel="changeRatio" 
        v-drag="changeRatio"
        )
        defs
          linearGradient#intL
            stop(offset="0%" :style="{ stopColor: freqColor(part1.freq, undefined, volL) }")
            stop(offset="100%" :style="{ stopColor: freqColor(fundamental.freq, undefined, volC) }")
        rect(:width="100 * ratio - 4" height="8" y="-4" x="1" rx="2" fill="url(#intL)")
        text(:x="100 * ratio / 2 - 2" text-anchor="middle" y=".5") 
          tspan.font-bold(:fill="freqColor(part1.freq)") {{ state.fraction.split('/')[0] }}
          tspan /
          tspan.font-bold(:fill="freqColor(fundamental.freq)") {{ state.fraction.split('/')[1] }}

      g#intervalR.touch-manipulation(
        @pointerdown="play(0); play(2)"
        @pointercancel="play(0, 0); play(2, 0)"
        @pointerup="play(0, 0); play(2, 0)"
        @pointerout="play(0, 0); play(2, 0)"
        v-wheel="changeRatio" 
        v-drag="changeRatio"
        )
        defs
          linearGradient#intR
            stop(offset="0%" :style="{ stopColor: freqColor(fundamental.freq, undefined, volC) }")
            stop(offset="100%" :style="{ stopColor: freqColor(part2.freq, undefined, volR) }")
        rect(:width="100 * (1 - ratio) - 4" height="8" y="-4" :x="100 - 100 * (1 - ratio) + 3" rx="2" fill="url(#intR)")
        text(:x="100 * ratio + 100 * (1 - ratio) / 2 + 2" text-anchor="middle" y=".5") 
          tspan.font-bold(:fill="freqColor(part2.freq)") {{ state.invFraction.split('/')[0] }}
          tspan /
          tspan.font-bold(:fill="freqColor(fundamental.freq)") {{ state.invFraction.split('/')[1] }}

    g#fundamental.cursor-pointer.touch-manipulation(
      v-drag="dragFun" 
      v-wheel="dragFun"
      @pointerdown="play(0)"
      @pointercancel="play(0, 0)"
      @pointerleave="play(0, 0)"
      @pointerout="play(0, 0)"
      @pointerup="play(0, 0)"
      )
      line(
        x2="100", 
        stroke-width="10", 
        :stroke="freqColor(fundamental.freq, 0.3 + 0.7 * volC)")
      circle(r="2")
      circle(cx="100", r="2")
      text(x="50" y=".5" font-weight="bold" text-anchor="end") 
        tspan.text-6px  {{ fundamental.note }} 
      text(x="50.5" y="-1.5" text-anchor="start")
        tspan.text-2px {{ fundamental.cents > 0 ? '+' : '' }}{{ fundamental.cents.toFixed() }}% 
        tspan.text-2px(x="50.75" y="1.5") {{ fundamental.freq.toFixed(2) }} Hz 

    g#divided.cursor-pointer.touch-manipulation(
      v-drag="changeRatio" 
      v-wheel="changeRatio"
      transform="translate(0,20)")

      g#part2(
        @pointerdown="play(2, 1)"
        @pointercancel="play(2, 0)"
        @pointerleave="play(2, 0)"
        @pointerout="play(2, 0)"
        @pointerup="play(2, 0)"
        )
        line( 
          :stroke="freqColor(part2.freq, 0.3 + 0.7 * volR)" 
          stroke-width="10",
          :x1="100 * ratio"
          x2="100"
          )
        circle(r="2" cx="100")
        g(:transform="`translate(${100 * ratio + 5 + 100 * (1 - ratio) / 2} 0.5)`")
          text.text-6px(y="0.3", x="-1" font-weight="bold" text-anchor="end")  {{ part2.note }} 
          text.text-2px( y="-1.5" text-anchor="start") {{ part2.cents > 0 ? '+' : '' }}{{ part2.cents.toFixed() }}% 
          text.text-2px( y="1.5" text-anchor="start") {{ part2.freq.toFixed(2) }} Hz 

      g#part1(
        @pointerdown="play(1, 1)"
        @pointercancel="play(1, 0)"
        @pointerleave="play(1, 0)"
        @pointerout="play(1, 0)"
        @pointerup="play(1, 0)"
        )
        line( 
          :stroke="freqColor(part1.freq, 0.3 + 0.7 * volL)" 
          stroke-width="10",
          :x2="100 * ratio"
        )
        circle(r="2")
        circle(:cx="100 * ratio" r="2")
        g(:transform="`translate(${100 * ratio / 2} 0.5)`")
          text.text-6px(y="0.3", x="-1" font-weight="bold" text-anchor="end")  {{ part1.note }} 
          text.text-2px( y="-1.5" text-anchor="start") {{ part1.cents > 0 ? '+' : '' }}{{ part1.cents.toFixed() }}% 
          text.text-2px( y="1.5" text-anchor="start") {{ part1.freq.toFixed(2) }} Hz 

    g#ruler.touch-manipulation(stroke-width="0.2" stroke="currentColor"  )
      line(y1="0" y2="20")
      line(x1="100" x2="100" y1="0" y2="20")
      line(:x1="100 * ratio" :x2="100 * ratio" y1="5" y2="20")
      rect.cursor-grab(width="8" height="8" opacity="0.3" rx="2" :x="100 * ratio - 4" y="6" v-wheel="changeRatio" v-drag="changeRatio" )

  .flex.flex-wrap.justify-center.p-2
    button.text-button.flex-1(
      :class="{ active: fName == state.fraction }"
      v-for="(frac, fName) in fractions" 
      :key="fName"
      @click="state.ratio = frac" ) {{ fName }}
</template>
