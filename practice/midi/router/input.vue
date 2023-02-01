<script setup>
import { useMidi, forwardMidi } from "#/use/midi";
import { noteColor } from "#/use/colors";
import { computed, watch } from "vue";

const props = defineProps({
  input: { type: Object, default: () => { } },
  iid: { type: [Number, String], default: 0 }
})

const { midi } = useMidi();

const color = computed(() => props.input?.note?.velocity > 0
  ? noteColor(props.input.note?.pitch, null, 1, 0.4)
  : "#7773")


</script>

<template lang="pug">
.p-4.shadow-lg.rounded-2xl.bg-light-900.dark-bg-dark-300.relative.border-2.shadow-lg(
  style="flex: 1 1 200px"
  )
  .flex.justify-between
    .flex-col
      .text-md {{ input.manufacturer }}
      .text-2xl.font-bold {{ input.name }}
    .flex-col.text-xs.font-mono.flex.gap-2.text-center

      .display(
        v-if="input.note" 
        :style="{ backgroundColor: color }") 
        .indicator(:style="{ transform: `scale(${input?.note?.attack},1)` }")
        i CH{{ input?.note?.channel }} 
        .px-1.rounded-sm(:style="{ backgroundColor: color }") {{ input?.note?.identifier }} 
        i {{ input?.note?.number }}

      .display(v-if="input.cc") 
        .indicator(
          :style="{ transform: `scale(${input?.cc?.value},1)` }"
        )
        i CH{{ input?.cc?.channel }} 
        i CC{{ input?.cc?.number }}
        i {{ input?.cc?.raw }}
      .display
        .indicator
        i {{ Math.floor(input?.bpm) }} BPM
        i {{ Math.floor(input?.clock/1000) }}s
  .flex.flex-wrap.gap-3.mt-4.items-center
    .text-xs TO
    button.px-2.shadow-sm.rounded-xl.bg-light-200.dark-bg-dark-500.cursor-pointer.border-2.border-transparent.select-none(
      v-for="(output, oid) in midi.outputs"
      v-show="input.name != output.name"
      :key="oid"
      :class="{ active: midi.forwards?.[iid]?.[oid] }"
      @click="forwardMidi(iid, oid)"
      ) 
      .text-sm {{ output.name }}
</template>


<style lang="postcss" scoped>
.active {
  @apply border-dark-200 dark-border-light-200;
}

.display {
  @apply overflow-hidden px-1 py-2px rounded-lg border-1 border-dark-50/50 w-16ch flex justify-between transition relative;
}

.indicator {
  @apply h-full w-full origin-left absolute top-0 left-0 border-r-1 transition border-dark-50/50 bg-dark-50 bg-opacity-20 dark-bg-light-50 dark-bg-opacity-20;
}
</style>