<script setup>
import { onKeyStroke } from "@vueuse/core";

import LoopSector from "./loop-sector.vue";
import ControlSector from './control-sector.vue'

import { getCircleCoord } from "#/use/calculations";
import { useSequence } from "#/use/sequence";
import { levelColor } from "#/use/colors";
import { tempo } from "#/use/tempo";
import { midi } from "#/use/midi";
// import { useUrlSearchParams } from '@vueuse/core'
import { controls } from './controls'
import { ref, computed, watch } from 'vue'
import { gainToDb } from "tone";
import { isDark } from "#/theme/composables/state";


const props = defineProps({
  radius: { type: Number, default: 400 },
  size: { type: Number, default: 175 },
  order: { type: Number, default: 0 },
});

const { sampler, seq, audio } = useSequence(undefined, props.order, "circle");

const soundLetters = ["A", "B", "C", "D", "E", "F"];
const soundControl = ref(soundLetters.findIndex((el) => el == seq.meter?.sound));
const controlRadius = computed(() => props.radius + 110);
const lastHit = ref(0)

onKeyStroke('Shift', () => {
  lastHit.value = seq.progress
})

watch(soundControl, (num) => {
  seq.meter.sound = soundLetters[num]
});

const activeSteps = computed(() => {
  return seq?.steps
    .filter((step) => !seq.mutes[step[0].split("-")[0]])
    .map((step) => Number(step[0].split("-")[0]));
});

const lineProgress = computed(() => {
  if (seq.progress > 0) {
    return getCircleCoord(seq.progress * 360, 360, props.radius + 50, 1000);
  } else {
    return { x: 500, y: 100 };
  }
});

const lastLine = computed(() => {
  if (seq.progress > 0) {
    return getCircleCoord(lastHit.value * 360, 360, props.radius + 50, 1000);
  } else {
    return { x: 500, y: 100 };
  }
});

const prevCC = ref(0);
const prevSteps = ref(4);

watch(
  () => midi.cc,
  (cc) => {
    if (cc.channel != controls.channel) return;

    if (cc.number == controls.cc[props.order].steps) {
      const diff = prevSteps.value - cc.raw;
      prevSteps.value = cc.raw;
      if (!diff) return;
      const can = seq.mutes.length - seq.mutesCount;
      if (can < 0) return;
      if (diff > 0 && seq.mutesCount <= 1) return;
      const index = seq.mutes.findIndex((mute) => mute == diff < 0);
      seq.mutes[index] = diff > 0;
      seq.reset();
    }
    if (cc.number == controls.cc[props.order].rotate) {
      const diff = prevCC.value - cc.raw;
      prevCC.value = cc.raw;
      seq.rotateAccents(diff);
    }
  }
);
</script>

<template lang="pug">
g(
  text-anchor="middle",
  style="user-select:none;transition:all 300ms ease"
)
  g(opacity="0.5")
    circle(
      cx="500"
      cy="500"
      :r="radius - 55"
      stroke-width="2"
      fill="transparent"
      stroke="currentColor"
    )
  g.steps(
    :opacity="seq?.volume"
  )
    g(
      v-for="(step, s) in seq.activeSteps"
      :key="step"
      )
      line(
        :x1="getCircleCoord(step, seq.steps.length, radius - 55, 1000).x"
        :y1="getCircleCoord(step, seq.steps.length, radius - 55, 1000).y"
        :x2="getCircleCoord(activeSteps[s + 1] || activeSteps[0], seq.steps.length, radius - 55, 1000).x"
        :y2="getCircleCoord(activeSteps[s + 1] || activeSteps[0], seq.steps.length, radius - 55, 1000).y"
        stroke-width="8"
        :stroke="levelColor((step + (tempo.pitch / 12) * seq.steps.length), seq.steps.length, 1)"
        )
    loop-sector(
      v-for="(step, s) in seq.steps"
      :key="step"
      :step="s"
      :total="seq.steps.length"
      :active="!seq.mutes[s] && step == seq.current"
      :radius="radius - 5"
      :muted="seq.mutes[s]"
      style="cursor:pointer"
      :accented="Boolean(seq.accents[s])"
      @accent="seq.accents[s] = !seq.accents[s]"
      @mute="seq.mutes[s] = !seq.mutes[s]"
    )
  control-sector.under(
    v-model="seq.meter.under"
    v-tooltip.top="'Measure subdivision'"
    :radius="controlRadius"
    :start="16 + order * 11"
    :finish="90"
    :step="1"
    font-size="30"
    :min="1"
    :max="16"
    :vector="[-1, -1]"
    show-positions
    :ratio="800"
    :every="4"
    :midi-c-c="controls.cc[order].under"
  )
    text {{ seq.meter?.under }}

  control-sector.over(
    v-model="seq.meter.over"
    v-tooltip.top="'Number of steps'"
    :radius="controlRadius"
    :start="343 - order * 11"
    :finish="270"
    :step="1"
    font-size="30"
    :min="2"
    :max="48 - order * 24"
    :vector="[1, -1]"
    show-positions
    :ratio="1000"
    :every="4"
    :midi-c-c="controls.cc[order].over"
  )
    text {{ seq.meter?.over }}

  control-sector.vol(
    :radius="controlRadius"
    :start="98 + order * 6"
    :finish="130"
    v-model="seq.volume"
    font-size="30"
    :fixed="1"
    :step="0.02"
    :min="0"
    :max="1"
    :vector="[1, -1]"
    v-tooltip.bottom="'Track volume'"
    :midiCC="controls.cc[order].vol"
  )
    i-la-volume-up(x="-18" y="-28")

  g.mute.opacity-30.hover-opacity-60.transition.cursor-pointer(
    :transform="`translate(${850-order*147},${800-order*128})`"
    @click="seq.mute = !seq.mute"
    :style="{opacity: seq.mute? 1 : ''}"
    )
    circle(
      style="filter:url(#shadowButton);"
      r="25"
      stroke-width="3"
      :stroke-opacity="seq.mute ? 1 : 0"
      :stroke="isDark ? '#ddd' : '#333'"
      :fill="isDark ? '#333' : '#ddd'"
      )
    i-la-volume-mute.text-4xl(x="-20" y="-21")

  control-sector.pan(
    :radius="controlRadius"
    :start="138 + order * 6"
    :finish="175"
    v-model="seq.pan"
    font-size="30"
    :fixed="1"
    :step="0.05"
    :min="-1"
    :max="1"
    show-center
    v-tooltip.bottom="'Track panning'"
    :midiCC="controls.cc[order].pan"
  )
    i-mdi-pan-horizontal(x="-18" y="-28")

  control-sector.sound(
    :radius="controlRadius"
    v-model="soundControl"
    :vector="[1, 1]"
    :start="183 + order * 6"
    :finish="262 - order * 6"
    font-size="30"
    :fixed="1"
    :step="1"
    :min="0"
    :max="5"
    show-positions
    :ratio="400"
    :every="1"
    v-tooltip.bottom="'Select sound'"

    :midiCC="controls.cc[order].sound"
  )
    text {{ seq.meter?.sound }}

  transition(name="fade")
    beat-recorder(
      :transform="`translate(200 ${800 - order * 220})`" 
      v-if="soundControl == 5 && !sampler.both"
      :recorder="sampler"
      @close="soundControl--"
    )

  g.info(
    :transform="`translate(500,${order * size + 50})`"
    v-drag="seq.rotateAccents"
  )
    g.signature(v-tooltip.top="'Time signature'")
      text(
        fill="currentColor"
        font-size="45"
      ) /
      text(
        fill="currentColor"
        font-family="Commissioner, sans-serif"
        font-size="40px"
        text-anchor="end",
        :x="-10",
        :y="-3",
        ) {{ seq.meter?.over }} 
      text(
        fill="currentColor"
        font-family="Commissioner, sans-serif"
        font-size="40px"
        text-anchor="start",
        :x="10",
        :y="-3",
        ) {{ seq.meter?.under }} 
    g.cursor-pointer.opacity-50.transition-all.duration-200.ease.hover-opacity-100(
      transform="translate(74,-10)"
      @mousedown="seq.rotateAccents(-1)"
      v-tooltip.top="'Rotate pattern forward'"
    )
      circle(
        r="18"
        fill="#5553"
      )
      i-la-angle-right(
        font-size="28"
        x="-17"
        y="-17"
      )
    g.cursor-pointer.opacity-50.transition-all.duration-200.ease.hover-opacity-100(
      transform="translate(-78,-10)"
      @mousedown="seq.rotateAccents(1)"
      v-tooltip.top="'Rotate pattern back'"
    )
      circle(
        r="18"
        fill="#5553"
      )
      i-la-angle-left(
        font-size="28"
        x="-17"
        y="-17"
      )
  g.arrow.pointer-events-none
    line(
      :x1="500"
      :y1="500"
      stroke-width="4"
      stroke="currentColor"
      stroke-linecap="cound"
      :x2="lastLine.x"
      :y2="lastLine.y"
      v-if="lastHit > 0"
      )
    line(
      :x1="500"
      :y1="500"
      stroke-width="4"
      stroke="currentColor"
      stroke-linecap="cound"
      :x2="lineProgress.x"
      :y2="lineProgress.y"
      )
    circle(
      :cx="500"
      :cy="500"
      fill="currentColor"
      :r="5"
      )
</template>

<style lang="postcss" scoped>
.info {
  @apply p-2 rounded-full m-1 border-1 border-current text-2xl;
}

.active {
  stroke: currentColor;
  font-weight: bold;
}

.active,
.measure.active {
  @apply bg-current transition-all duration-200;
}

.measure {
  background-color: hsla(0, 0%, 50%, 0.5);
}
</style>
