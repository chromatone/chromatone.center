<template lang="pug">
.flex.flex-col.items-center.w-full.p-4.has-bg.rounded-xl#screen.relative
  client-only 
    state-transport(v-if="!secondary")
    full-screen.absolute.bottom-1.right-1
    beat-bars-bar.my-1.rounded-xl.shadow-lg(
      v-for="(loop,i) in loops",
      :key="loop"
      :order="i"
      :loop="loop"
      :maxRatio="maxRatio"
      @del="loops.splice(i, 1)"
      @over="loop.over = clampNum(loop.over, $event, 1, 16)"
      @under="loop.under = clampNum(loop.under, $event, 1, 16)"
      @sound="loop.sound = $event"
      :editable="!meters"
      :accent="pattern"
      :mute="mute"
    )
    .flex.flex-wrap.justify-center.is-group.m-1.text-xl.p-2
      button.text-button(
        @click="loops.push({ ...newLoop })"
        v-if="!meters"
      )
        la-plus
      .is-group.m-2(v-if="meters && meters.length > 1")
        button.text-button(
          v-for="met in meters"
          @click="loops = [{ over: met.split('/')[0], under: met.split('/')[1], sound: 'A', volume: 1 }]"
        ) {{ met }}
      button.text-button(
        :class="{ active: pattern == p }"
        v-for="(pat,p) in patterns"
        @click="pattern = p; loops[0].over = p.length; loops[0].under = pat.meter ? pat.meter.split('/')[1] : p.length"
      ) {{ pat?.names?.[0]?.name || p }}
    .flex.flex-col.p-2.my-2.is-group(v-if="patterns")
      .flex.flex
        .flex-1.p-1.border-1.border-current.rounded-lg.m-1.opacity-50(
          v-for="(accent,a) in pattern" :key="a"
          :style="{ backgroundColor: accent == 1 ? 'currentColor' : 'transparent' }"
        )
      .flex.flex-wrap.justify-center
        .p-1(v-for="pt in patterns[pattern]?.names" :key="pt") 
          span.font-bold.mx-2 {{ pt.name }}  
          span(v-if="pt.place") ({{ pt.place }})
</template>

<script setup>
import { clampNum } from '@use/theory'

const props = defineProps({
  meters: {
    type: Array,
    default: null
  },
  patterns: {
    type: Object,
    default: null,
  },
  accent: {
    type: String,
    default: '11111111111111111'
  },
  mute: {
    type: String,
    delault: '00000000000000000'
  },
  secondary: {
    type: Boolean,
    default: false,
  },
})

const pattern = ref(props.accent)

const loops = useStorage('tempo-bar-loops', [
  {
    over: 8,
    under: 8,
    volume: 1,
    sound: 'A'
  },
  {
    over: 3,
    under: 3,
    volume: 0.5,
    sound: 'B'
  }]);

const newLoop = reactive({
  over: 4,
  under: 4,
  volume: 1,
  sound: 'A'
})

if (props.meters) {
  let nums = props.meters[0].split('/')
  loops.value = [{
    over: Number(nums[0]),
    under: Number(nums[1]),
    volume: props.secondary ? 0 : 1,
    sound: 'A'
  }]
}

if (props.patterns) {
  pattern.value = Object.keys(props.patterns)[0]
}

const maxRatio = computed(() => {
  let max = 0
  loops.value.forEach(loop => {
    let ratio = loop.over / loop.under
    if (ratio > max) {
      max = ratio
    }
  })
  return max
})

function changeLoop(l, n, diff) {
  let num = loops.value[l][n] + diff
  if (num >= 1 && num <= 32) {
    loops.value[l][n] = num
  }
}

</script>

<style scoped>
</style>