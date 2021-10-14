<template lang="pug">
g.cursor-pointer(
  :transform="`translate(${proportion * (step - 1) * width + pad},0)`"
)
  rect.transition-fill.duration-100(
    @mousedown="$emit('mute')"
    :width="proportion * width"
    height="180"
    :fill="active ? color : 'transparent'"

  )
  circle(
    @click="$emit('accent')"
    cy="45"
    cx="30"
    r="25"
    stroke-width="4"
    :stroke="color"
    :fill="accented ? color : 'transparent'"
  )
  text.pointer-events-none(
    y="60"
    font-size="40"
    text-anchor="middle"
    x="30"
    fill="currentColor"
  ) {{ step }}
  g.sub(
    v-for="(sub,s) in subdivisions" :key="sub"
    @dblclick="$emit('subdivide', [`${sub}-1`]); division = 40"
    :data-sub="sub"
    v-drag="dragDiv"
  )
    line(
      :transform="`translate(${s * proportion * width / subdivisions.length}, 0)`"
      y1="80"
      y2="180"
      stroke-width="1"
      stroke="currentColor"
    )
    rect.transition-fill.duration-100(
      :width="proportion * width / subdivisions.length"
      height="80"
      y="100"
      :x="s * proportion * width / subdivisions.length"
      :fill="`hsla(0,0%,${90 - s * 80 / subdivisions.length}%,${sub == current ? 0.9 : 0.4})`"
    )
    text(
      v-if="!mutes[sub]"
      y="140"
      font-size="40"
      text-anchor="middle"
      :x="15 + s * proportion * width / subdivisions.length"
      fill="currentColor"
    ) {{ s + 1 }}
  line(
    y2="180"
    stroke-width="8"
    stroke-linecap="round"
    :stroke="levelColor(props.step - 1, props.total, 1)"
  )
</template>

<script setup>
import { levelColor } from "@use/colors.js"
import { colord } from 'colord'
import { clampNum } from '@use/theory'

const props = defineProps({
  proportion: {
    type: Number,
    default: 1
  },
  step: {
    type: Number,
    default: 1
  },
  subdivisions: {
    type: Array,
    default: []
  },
  total: {
    type: Number,
    default: 4
  },
  current: {
    type: [Number, String],
    default: 0
  },
  mutes: {
    type: Object,
    default: {}
  },
  accented: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 900
  },
  pad: {
    type: Number,
    default: 50
  }
});


const emit = defineEmits(['mute', 'subdivide', 'accent'])

const color = computed(() => levelColor(props.step - 1, props.total, 1))
const accent = computed(() => props.subdivisions[0].includes('!'))

const division = ref(0)
const divNum = computed(() => Math.floor(division.value / 40))
const divSteps = ref([])

watch(divNum, (next, prev) => {
  if (next == prev) return
  let steps = []
  for (let d = 1; d <= next; d++) {
    steps.push(`${props.step}-${d}`)
  }
  divSteps.value = steps
})

watch(divSteps, steps => emit('subdivide', steps))

function dragDiv(drag) {
  if (drag.tap) {
    let sub = drag.event.currentTarget.dataset.sub
    props.mutes[sub] = !props.mutes[sub]
  }
  division.value = clampNum(division.value, drag.delta[0] - drag.delta[1], 40, 640)
}

const active = computed(() => {
  let isParent = props.subdivisions[0] == props.current
  let p = props.subdivisions[0].split('-')[0]
  let c = props.current.split('-')[0]
  let isMuted = props.mutes[props.subdivisions[0]]
  return !isMuted && (isParent || p == c)
});



</script>

<style scoped>
</style>