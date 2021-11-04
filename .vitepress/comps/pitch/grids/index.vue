<script setup>
import { lchToHsl } from '@use/colors'
import { isDark } from '@theme/composables/state'
import { renderMidi } from './loop'

const loops = useStorage('pitch-bars', [1])

function addLoop() {
  loops.value.push(Math.ceil(Math.random() * 100))
  active.value = loops.value.length - 1
}

const active = useStorage('pitch-bars-active', 0);
</script>

<template lang="pug">
#screen.flex.flex-col.items-center.rounded-xl.fullscreen-container.p-2
  state-transport
    control-scale.m-4
  .flex.flex-wrap.mt-4.w-full.justify-start.px-2
    button.px-4.rounded-t-md.mx-2px.transition-all.duration-300.ease.flex.items-center(
      v-for="(loop,l) in loops" :key="loop"
      @mousedown="active = l"
      :class="{ active: active == l }"
      :style="{ backgroundColor: lchToHsl(l, loops.length, active == l ? 1 : 0.3) }"
    ) 
      //- la-times.mr-2(
      //-   @mousedown="loops.splice(l, 1); active = loops.length - 1"
      //- )
      .px-4.py-2 {{ l }}

    button.text-button(
    @click="addLoop()"
    )
      la-plus
    .flex-1
    full-screen
    button.text-button.flex.items-center(@click="renderMidi()")
      la-file-download
  .flex.flex-col.mb-4.mx-4.w-full.relative.h-600px
    transition-group(name="fade")
      pitch-grids-grid.absolute.w-full(
        v-for="(loop,l) in loops" :key="loop"
        :order="l"
        :active="active == l"
        :color="lchToHsl(l, loops.length, isDark ? 0.3 : 1)"
        @del="loops.splice(l, 1); active = loops.length - 1"
      )
</template>
