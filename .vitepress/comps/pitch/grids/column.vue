<script setup>
const props = defineProps({
  step: {
    type: Array,
    default: [{}]
  },
  pos: {
    type: Number,
    default: 0
  },
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 500,
  },
  footer: {
    type: Number,
    default: 60,
  },
  color: {
    type: String,
    default: 'gray',
  },
  active: {
    type: Boolean,
    default: false,
  }
});

import { isDark } from '@theme/composables/state'
import { globalScale, clampNum } from '@use/theory'
import { pitchColor } from 'chromatone-theory'
import { Frequency } from 'tone'
import { Chord } from "@tonaljs/tonal"

const emit = defineEmits(['subdivide'])

const division = ref(0)
const divNum = computed(() => Math.floor(division.value / 20))

watch(divNum, (next, prev) => {
  if (next == prev) return
  let subdivisions = [...props.step]
  if (next < subdivisions.length) {
    subdivisions.length = next
  } else {
    for (let d = subdivisions.length; d < next; d++) {
      subdivisions.push({})
    }
  }
  emit('subdivide', subdivisions.map(sub => ({ ...sub, sub: next })))
})

function dragDiv(drag) {
  division.value = clampNum(division.value, drag.delta[0] - drag.delta[1], 20, 160)
}

const doubleScale = computed(() => (globalScale.set.chroma + globalScale.set.chroma + 1).split(''));

function getChord(step) {
  let notes = Object.entries(step).map((entry) => {
    if (entry[0] == 'sub') return
    if (entry[1]) return Frequency(Number(entry[0]) + globalScale.tonic + 69, 'midi').toNote()
  }).filter(n => n != null)
  return Chord.detect(notes)[0]
}

</script>


<template lang="pug">
g.col(
  :transform="`translate(${pos * width} 0)`"      
  )
  g.cell(
    v-for="(cell,c) in 25" :key="c"
    :transform="`translate(0 ${height - cell * height / 25})`"
  )
    g.sub(
      v-for="(sub,s) in step" :key="sub"
    )
      rect.transition-all.duration-200.ease-out(
        stroke-width="0"
        :x="s * width / step.length + 1"
        :width="width / step.length - 2"
        :height="height / 25 - 2"
        rx="4"
        :fill="pitchColor(cell + globalScale.tonic - 1, 3, doubleScale[c] == 1 ? 1 : 0.1, sub[c] ? 1 : 0.1)"
        @mousedown="sub[c] = !sub[c]"
      )
      line.line.pointer-events-none.transition-all.duration-200.ease-out(
        :x1="s * width / step.length"
        :x2="(s + 1) * width / step.length"
        :y1="10"
        :y2="10"
        :stroke-width="sub[c] ? 2 : 6"
        stroke-opacity="0.1"
        :stroke="sub[c] ? 'black' : pitchColor(cell + globalScale.tonic - 1, 3, 1)"
      )
  g.subs(
    v-drag="dragDiv"
    :transform="`translate(0 ${height})`"
    v-show="active"
  )
    rect(
      :width="width"
      :height="footer"
      fill="transparent"
    )
    g(
      :transform="`translate(${s * width / step.length} 0)`"
      v-for="(sub,s) in step" :key="sub"
    )
      rect(
        :data-pos="pos"
        :height="footer"
        stroke="currentColor"
        fill="#5552"
        :width="width / step.length"

      )
      text.font-bold.text-xl(
        :x="width / step.length / 2"
        :y="40"
        fill="currentColor"
        text-anchor="middle"
      ) {{ getChord(sub) }}
</template>

<style scoped>
.sub:hover .line {
  stroke-opacity: 1;
}
</style>