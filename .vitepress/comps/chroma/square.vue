<template lang="pug">
svg.select-none.max-w-12em.my-4.mx-auto(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 100 100",
  xmlns="http://www.w3.org/2000/svg",
  style="touch-action:none"
  font-family="Commissioner, sans-serif"
  text-anchor="middle",
  dominant-baseline="middle"
)
  g.transition-all.duration-400.cursor-pointer(
    v-for="(note,n) in actualChroma" :key="n" 
    :transform="`translate(${getRect(n).x},${getRect(n).y})`"
    @mousedown="globalScale.tonic = n"
    :opacity="note == '1' ? 1 : 0.62"
  )
    rect(
      :x="0"
      :y="0"
      :width="state.width / 4"
      :height="state.height / 4"
      :fill="colord(note == '1' ? pitchColor(n, 3) : notes[n].pos == 0 ? 'hsl(0,0%,85%)' : 'hsl(0,0%,60%)').toHex()"
      :opacity="note == '1' ? 1 : 0.62"
    )
    text(
      v-if="note == '1'"
      :y="state.height / 8"
      :x="state.width / 8"
      :font-size="n == actualPitch ? 12 : 8"
      font-weight="bold"
      fill="#eee"
      ) {{ notes[n]?.name }}
    text(
      v-if="note == '0'"
      :y="state.height / 8"
      :x="state.width / 8"
      font-size="10px"
      font-weight="normal"
      fill="white"
      ) {{ n }}

  g.center.cursor-pointer(
    @mousedown.prevent.stop="playChroma(chroma, actualPitch); pressed = true"
    @touchstart.prevent.stop="playChroma(chroma, actualPitch); pressed = true"
    @touchend="stopChroma(chroma, actualPitch); pressed = false"
    @touchcancel="stopChroma(chroma, actualPitch); pressed = false"
    @mouseup="stopChroma(chroma, actualPitch); pressed = false"
    @mouseleave="stopChroma(chroma, actualPitch); pressed = false"
    :class="{ pressed }"
  )
    rect(
      :x="state.width / 4"
      :y="state.width / 4"
      :width="state.width / 2"
      :height="state.height / 2"
      :fill="pitch === false ? 'none' : chromaColorMix(chroma, actualPitch).hsl"
      :stroke="pitchColor(globalScale.tonic)"
      stroke-width="2px"
      )
    text(
      :x="state.width / 2"
      :y="state.height / 2"
      font-size="14px"
      font-weight="bold"
      fill="white"
      ) {{ pitch === false ? '' : typeof pitch == 'string' ? pitch : notes[actualPitch]?.name }}{{ chord.aliases[0] }}
    text.function(
      v-if="props.roman"
      :x="state.width / 2"
      :y="state.height / 2 + 15"
      font-size="10px"
      font-weight="bold"
      fill="white"
      ) {{ props.roman }}
</template>

<script setup>
const props = defineProps({
  pitch: { type: Number, default: 0 },
  chroma: { type: String, default: '1001000100101' },
  mode: { type: String, default: 'O' },
  tonic: { type: Number, default: 0 },
  roman: { type: String, default: '' },
});
import { notes, rotateArray, getCircleCoord, pitchColor } from 'chromatone-theory'
import { colord } from 'colord'
import { chromaColorMix } from "@use/colors.js";
import { playChroma, chordType, scaleType, stopChroma, globalScale } from '@use/theory.js'
const pressed = ref(false);

const state = reactive({
  width: 100,
  height: 100
})

const actualChroma = computed(() => {
  return rotateArray(props.chroma.split(''), -actualPitch.value)
})

const actualPitch = computed(() => {
  if (props.pitch === 0 || props.pitch) {
    return props.pitch
  } else {
    return globalScale.tonic
  }
})
const chord = computed(() => chordType.get(props.chroma));
const scale = computed(() => scaleType.get(props.chroma).name)

function getRect(n, w = state.width, h = state.height) {
  let posX, posY, x, y
  if (props.mode == 'Z') {
    posX = n % 4
    posY = Math.floor(n / 4) + 1
    if (n > 3 && n < 8) { posX = 3 - posX }
  } else if (props.mode == 'O') {
    switch (n) {
      case 0: posX = 0; posY = 0; break;
      case 1: posX = 1; posY = 0; break;
      case 2: posX = 2; posY = 0; break;
      case 3: posX = 3; posY = 0; break;
      case 4: posX = 3; posY = 1; break;
      case 5: posX = 3; posY = 2; break;
      case 6: posX = 3; posY = 3; break;
      case 7: posX = 2; posY = 3; break;
      case 8: posX = 1; posY = 3; break;
      case 9: posX = 0; posY = 3; break;
      case 10: posX = 0; posY = 2; break;
      case 11: posX = 0; posY = 1; break;
    }
  }
  return {
    x: posX * w / 4,
    y: posY * h / 4
  }
}

</script>

<style scoped>
.center {
  @apply transition-all duration-200 ease-in-out;
  &:hover {
  }
  &.pressed {
    filter: brightness(1.1);
  }
}
</style>