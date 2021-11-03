<script setup>
import { lchToHsl } from '@use/colors'
const loops = useStorage('pitch-bars', [
  {
    over: 8,
    under: 8,
    tonic: 69,
    pitch: 0,
    octave: 3,
    volume: 1,
    sound: 'A',
  }
])

function addLoop() {
  loops.value.push({
    over: 16,
    under: 16,
    pitch: 0,
    octave: 2,
    tonic: 69,
    volume: 1,
    sound: 'A',
  })
  active.value = loops.value.length - 1
}

const active = useStorage('pitch-bars-active', 0);
</script>

<template lang="pug">
.flex.flex-col.items-center
  state-transport
  .flex.flex-wrap.mt-4
    button.px-4.rounded-t-md.mx-2px(
      v-for="(loop,l) in loops" :key="loop"
      @mousedown="active = l"
      :class="{ active: active == l }"
      :style="{ backgroundColor: lchToHsl(l, loops.length, active == l ? 1 : 0.5) }"
    ) {{ loop.over }}/{{ loop.under }}
    button.text-button(
    @click="addLoop()"
    )
      la-plus
  .flex.flex-col.mb-4.mx-4.w-full.relative.h-600px
    transition-group(name="fade")
      pitch-bars-bar.absolute.w-full(
        v-for="(loop,l) in loops" :key="loop"
        :order="l"
        :loop="loop"
        :active="active == l"
        :color="lchToHsl(l, loops.length, 1)"
        @del="loops.splice(l, 1); active = loops.length - 1"
        @over="loop.over = $event"
        @under="loop.under = $event"
        @pitch="loop.pitch = $event"
        @octave="loop.octave = $event"
      )


</template>
