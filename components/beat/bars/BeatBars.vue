<script setup>
import { renderMidi } from '#/use/midiRender'
import { tracks, maxRatio } from '#/use/sequence'
import { loops } from './loops';
import { reactive, ref, watch } from 'vue'

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
    loops.value = {
      0: {
        over: Number(nums[0]),
        under: Number(nums[1]),
        volume: props.secondary ? 0 : 1,
        sound: 'A'
      }
    }
  }
}, { immediate: true })

watch(() => props.patterns, p => {
  if (p) {
    pattern.value = Object.keys(p)[0]
  }
}, { immediate: true })

function selectPattern(p, meter) {
  loops.value = {
    0: {
      over: p.length,
      under: Number(meter ? meter.split('/')[1] : p.length),
      volume: props.secondary ? 0 : 1,
      sound: 'A'
    }
  }
  pattern.value = p;
  console.log(loops.value)
}

function addLoop() {
  loops.value[Math.floor(Math.random() * 10000)] = { ...newLoop }
}

</script>

<template lang="pug">
.flex.flex-wrap.items-center.w-full.p-4.has-bg.rounded-xl#screen.relative.gap-6.bg-light-600.dark-bg-dark-500
  client-only 
    state-transport(v-if="!secondary" :secondary="true")
    beat-bars-bar.my-1.rounded-3xl.shadow-lg.min-h-36.max-h-30vh(
      style="flex: 1 1 420px"
      v-for="(loop, i) in loops"
      :key="i"
      :order="Number(i)"
      :loop="loop"
      :maxRatio="maxRatio"
      @del="delete loops[i]"
      :editable="!meters"
      :accents="pattern"
      :mute="mute"
      ) 
    .flex.flex-col.p-2.my-2.is-group.w-full(v-if="patterns")
      .flex.flex
        .flex-1.p-1.border-1.border-current.rounded-lg.m-1.opacity-50(
          v-for="(accent, a) in pattern" :key="a"
          :style="{ opacity: accent == 'X' ? 1 : 0.5, backgroundColor: accent == '1' || accent == 'X' || accent == 'x' ? 'currentColor' : 'transparent' }"
          )
      .flex.flex-wrap.justify-center
        .p-1(v-for="pt in patterns[pattern]?.names" :key="pt") 
          span.font-bold.mx-2 {{ pt.name }}  
          span(v-if="pt.place") ({{ pt.place }})
    .flex.flex-wrap.justify-center.is-group.m-1.text-xl.p-2(
      style="flex: 1 1 100%"
      )
      button.text-button(
        @click="addLoop()"
        v-if="!meters"
        v-tooltip.bottom="'Add new track'"
        )
        .i-la-plus
      button.text-button.flex.items-center(@click="renderMidi(tracks)" v-tooltip.bottom="'Export MIDI file'")
        .i-la-file-download
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

    

</template>
