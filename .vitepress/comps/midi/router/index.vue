<script setup>
import { useMidi } from '@use/midi.js'
const { midi, midiAttack, midiRelease, setCC } = useMidi();
</script>

<template lang='pug'>
.flex.flex-wrap.gap-4.justify-center
  .p-4.shadow-lg.rounded-2xl.bg-light-200.dark_bg-dark-300.relative(
    v-for="(input, id) in midi.inputs" 
    :key="id"
    )
    .p-1.absolute.top-4.right-12px.bg-dark-100.dark_bg-light-100.bg-opacity-30.dark_bg-opacity-30.rounded-xl.transition-all.duration-100(
      :class="{ active: midi.note.port == id && midi.note.velocity > 0 }"
    )
    .py-10px.px-1px.absolute.top-10px.right-15px.bg-dark-100.dark_bg-light-100.bg-opacity-30.dark_bg-opacity-30.rounded-xl(
      :style="{ transform: `rotate(${(midi.cc.port == id ? midi.cc.value : 0) * 180 + 90}deg)` }"
    )
    .text-sm.mb-2 {{ input.manufacturer }}
    .text-xl.font-bold {{ input.name }}
    .flex.flex-wrap.gap-2.mt-4
      .p-4.shadow-md.rounded-xl.bg-light-500.dark_bg-dark-500(
        v-for="(output, oid) in midi.outputs"
        :key="oid"
        v-show="oid != id"
        ) 
        .text-md.font-bold {{ output.name }}
</template>

<style lang="postcss" scoped>
.active {
  @apply bg-opacity-100;
}
</style>