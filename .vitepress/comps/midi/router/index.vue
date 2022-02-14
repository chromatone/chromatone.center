<script setup>
import { useMidi, forwardMidi } from '@use/midi.js'
import { pitchColor } from '@theory'
const { midi, midiAttack, midiRelease, setCC } = useMidi();
</script>

<template lang='pug'>
.flex.flex-wrap.gap-4.justify-center
  .p-4.shadow-lg.rounded-2xl.bg-light-900.dark_bg-dark-300.relative(
    style="flex: 1 1 200px"
    v-for="(input, iid) in midi.inputs" 
    :key="iid"
    )
    .py-12px.px-1px.absolute.top-8px.right-15px.bg-dark-800.dark_bg-light-100.rounded-xl(
      :style="{ transform: `rotate(${input.cc * 180 + 90}deg)` }"
    )
    .p-1.absolute.top-4.right-12px.rounded-xl.transition-all.duration-100(
      :style="{ backgroundColor: midi.note.port == iid && midi.note.velocity > 0 ? pitchColor(midi.note?.pitch) : '#333' }"
    )

    .text-sm {{ input.manufacturer }}
    .text-xl.font-bold {{ input.name }}
    .flex.flex-wrap.gap-3.mt-4
      .px-2.shadow-sm.rounded-xl.bg-light-200.dark_bg-dark-500.cursor-pointer.border-2.border-transparent(
        :class="{ active: midi.forwards?.[iid]?.[oid] }"
        @click="forwardMidi(iid, oid)"
        v-for="(output, oid) in midi.outputs"
        :key="oid"
        v-show="input.name != output.name"
        ) 
        .text-sm {{ output.name }}
</template>

<style lang="postcss" scoped>
.active {
  @apply border-dark-200 dark_border-light-200;
}
</style>
