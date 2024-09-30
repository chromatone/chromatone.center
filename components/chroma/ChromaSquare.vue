<script setup>
import { rotateArray, getCircleCoord } from '#/use/calculations'
import { colord } from 'colord'
import { chromaColorMix, noteColor } from "#/use/colors";
import { intervals, notes } from '#/use/theory'
import { playChroma, stopChroma } from '#/use/chroma'
import { globalScale } from '#/use/global'
import { computed, reactive, ref } from 'vue';
import { ChordType, ScaleType } from 'tonal'

const emit = defineEmits(['update:chroma'])

const props = defineProps({
  pitch: { type: Number, default: null },
  chroma: { type: String, default: '1001000100101' },
  mode: { type: String, default: 'O' },
  tonic: { type: Number, default: 0 },
  roman: { type: String, default: '' },
  editable: { type: Boolean, default: false }
});
const pressed = ref(false);

const state = reactive({
  width: 100,
  height: 100
})

const squarePositions = [
  [0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3], [0, 3], [0, 2], [0, 1]
]

const actualPitch = computed(() => {
  if (props.pitch === 0 || props.pitch) {
    return props.pitch
  } else {
    return globalScale.tonic
  }
})
const chord = computed(() => ChordType.get(props.chroma));
const scale = computed(() => ScaleType.get(props.chroma).name)

function getRect(n, w = state.width, h = state.height) {
  let posX, posY, x, y
  if (props.mode == 'Z') {
    posX = n % 4
    posY = Math.floor(n / 4) + 1
    if (n > 3 && n < 8) { posX = 3 - posX }
  } else if (props.mode == 'O') {
    [posX, posY] = squarePositions[n]
  }
  return `translate(${posX * w / 4},${posY * h / 4})`
}

function toggleStep(i) {
  if (!props.editable) return
  let chroma = [...props.chroma.split('')]
  if (chroma[i] == '1') {
    chroma[i] = '0'
  } else {
    chroma[i] = '1'
  }
  emit('update:chroma', chroma.join(''))
}

</script>


<template lang="pug">
svg.select-none.min-w-8em.m-2(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 100 100",
  xmlns="http://www.w3.org/2000/svg",
  style="touch-action:none"
  font-family="Commissioner, sans-serif"
  text-anchor="middle",
  dominant-baseline="middle"
)
  rect(
    width="100"
    height="100"
    rx="8"
    opacity="0.6"
    :fill="chromaColorMix(chroma, actualPitch).hsl"
  )
  g.transition-all.duration-400.ease-in-out.cursor-pointer(
    v-for="(note, n) in chroma" :key="n" 
    :transform="getRect(n)"
    @mousedown="toggleStep(n)"
    :opacity="note == '1' ? 1 : 0.62"
  )
    rect.transition-all.duration-200.ease-in-out(
      :x="2"
      :y="2"
      rx="6"
      :width="state.width / 4 - 4"
      :height="state.height / 4 - 4"
      :fill="colord(note == '1' ? noteColor((n + actualPitch) % 12, 3) : notes[(n + globalScale.tonic) % 12].length != 2 ? 'hsl(0,0%,85%)' : 'hsl(0,0%,40%)').toHex()"
    )
    text(
      v-if="note == '1'"
      :y="state.height / 8 + 1"
      :x="state.width / 8"
      :font-size="8"
      font-weight="bold"
      :fill="colord(noteColor(n + globalScale.tonic)).isDark() ? 'white' : 'black'"
      ) {{ notes[(n + actualPitch) % 12] }}
    text(
      v-if="note == '0'"
      :y="state.height / 8 + 1"
      :x="state.width / 8"
      font-size="6px"
      font-weight="normal"
      fill="black"
      opacity="0.5"
      ) {{ intervals[n] }}

  g.center.cursor-pointer(
    @mousedown.prevent.stop="playChroma(chroma, actualPitch); pressed = true"
    @touchstart.prevent.stop="playChroma(chroma, actualPitch); pressed = true"
    @touchend="stopChroma(chroma, actualPitch); pressed = false"
    @touchcancel="stopChroma(chroma, actualPitch); pressed = false"
    @mouseup="stopChroma(chroma, actualPitch); pressed = false"
    @mouseleave="stopChroma(chroma, actualPitch); pressed = false"
    :class="{ pressed }"
  )
    rect.transition-all.duration-400.ease-in-out(
      rx="4"
      :x="state.width / 4 + 2"
      :y="state.width / 4 + 2"
      :width="state.width / 2 - 4"
      :height="state.height / 2 - 4"
      :fill="pitch === false ? 'none' : noteColor(actualPitch, 3)"
      :stroke="noteColor(globalScale.tonic, 3, 1, 0.5)"
      stroke-width="2"
      )
    text(
      :x="state.width / 2"
      :y="state.height / 2"
      font-size="10px"
      font-weight="bold"
      fill="white"
      ) {{ pitch === false ? '' : typeof pitch == 'string' ? pitch : notes[actualPitch] }}{{ chord.aliases[0] }}
    text.function(
      v-if="props.roman"
      :x="state.width / 2"
      :y="state.height / 2 + 13"
      font-size="8px"
      font-weight="normal"
      fill="white"
      ) {{ props.roman }}
</template>


<style lang="postcss" scoped>
.center {
  @apply transition-all duration-200 ease-in-out;
}

.center.pressed {
  filter: brightness(1.1);
}
</style>