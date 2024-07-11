<script setup>
import { lchToHsl } from '#/use/colors'
import { useData } from 'vitepress'
const { isDark } = useData()
import { renderMidiFile } from '#/use/loop'
import { useStorage } from '@vueuse/core';
import ChromaGridsGrid from './ChromaGridsGrid.vue';

const loops = useStorage('pitch-bars', [1])

function addLoop() {
  loops.value.push(Math.ceil(Math.random() * 100))
  active.value = loops.value.length - 1
}

const active = useStorage('pitch-bars-active', 0);
</script>

<template lang="pug">
#screen.flex.flex-col.items-center.rounded-3xl.fullscreen-container.p-2
  .flex.flex-wrap.mt-4.w-full.justify-start.px-6
    button.px-2.rounded-t-xl.mx-2px.transition-all.duration-300.ease.flex.items-center(
      v-for="(loop, l) in loops" 
      :key="loop"
      :class="{ active: active == l }"
      :style="{ backgroundColor: lchToHsl(l, loops.length, active == l ? 1 : 0.3) }"
      @mousedown="active = l"
    ) 
      .px-4.py-2 {{ l }}

    button.text-button(
    @click="addLoop()"
    )
      .i-la-plus
    .flex-1
    button.text-button.flex.items-center(@click="renderMidiFile()")
      .i-la-file-download
  .flex.flex-col.mb-4.mx-4.w-full.relative
    transition-group(name="fade")
      chroma-grids-grid.w-full(
        :class="{ absolute: l > 0 }"
        v-for="(loop, l) in loops" 
        :key="loop"
        :order="l"
        :active="active == l"
        :color="lchToHsl(l, loops.length, isDark ? 0.3 : 1)"
        @del="loops.splice(l, 1); active = loops.length - 1"
      )
</template>
