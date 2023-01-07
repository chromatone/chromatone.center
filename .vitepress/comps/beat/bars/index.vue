<script setup>
import BeatBar from './bar.vue'

import { renderMidi } from '#/use/midiRender'
import { tracks, maxRatio } from '#/use/sequence'
import { loops } from './loops';

const props = defineProps({
  meters: { type: Array, default: null },
  patterns: { type: Object, default: null, },
  accents: { type: String, default: 'XxXxXxXx' },
  mute: { type: String, delault: '' },
  secondary: { type: Boolean, default: false, },
})

const pattern = ref(props.accents)

const newLoop = reactive({
  over: 4,
  under: 4,
  volume: 1,
  sound: 'A'
})

watch(() => props.meters, m => {
  if (m) {
    let nums = m[0].split('/')
    loops.value = [{
      over: Number(nums[0]),
      under: Number(nums[1]),
      volume: props.secondary ? 0 : 1,
      sound: 'A'
    }]
  }
}, { immediate: true })

watch(() => props.patterns, p => {
  if (p) {
    pattern.value = Object.keys(p)[0]
  }
}, { immediate: true })

function selectPattern(p, meter) {
  loops.value[0].over = p.length;
  loops.value[0].under = meter ? meter.split('/')[1] : p.length
  pattern.value = p;
}

</script>

<template lang="pug">
.flex.flex-col.items-center.w-full.p-4.has-bg.rounded-xl#screen.relative.gap-6
  client-only 
    state-transport(v-if="!secondary" :secondary="true")
    beat-bar.my-1.rounded-3xl.shadow-lg(
      v-for="(loop, i) in loops",
      :key="loop"
      :order="i"
      :loop="loop"
      :maxRatio="maxRatio"
      @del="loops.splice(i, 1)"
      :editable="!meters"
      :accents="pattern"
      :mute="mute"
    )
    .flex.flex-wrap.justify-center.is-group.m-1.text-xl.p-2
      button.text-button(
        @click="loops.push({ ...newLoop })"
        v-if="!meters"
        v-tooltip.bottom="'Add new track'"
        )
        la-plus
      button.text-button.flex.items-center(@click="renderMidi(tracks)" v-tooltip.bottom="'Export MIDI file'")
        la-file-download
      full-screen.text-md(v-tooltip.bottom="'Toggle fullscreen'")
      .is-group.m-2(v-if="meters && meters.length > 1")

        button.text-button(
          v-for="met in meters"
          @click="loops = [{ over: met.split('/')[0], under: met.split('/')[1], sound: 'A', volume: 1 }]"
        ) {{ met }}

      button.text-button(
        :class="{ active: pattern == p }"
        v-for="(pat, p) in patterns"
        @click="selectPattern(p, pat.meter)"
      ) {{ pat?.names?.[0]?.name || p }}

    .flex.flex-col.p-2.my-2.is-group(v-if="patterns")
      .flex.flex
        .flex-1.p-1.border-1.border-current.rounded-lg.m-1.opacity-50(
          v-for="(accent, a) in pattern" :key="a"
          :style="{ opacity: accent == 'X' ? 1 : 0.5, backgroundColor: accent == '1' || accent == 'X' || accent == 'x' ? 'currentColor' : 'transparent' }"
        )
      .flex.flex-wrap.justify-center
        .p-1(v-for="pt in patterns[pattern]?.names" :key="pt") 
          span.font-bold.mx-2 {{ pt.name }}  
          span(v-if="pt.place") ({{ pt.place }})

</template>


