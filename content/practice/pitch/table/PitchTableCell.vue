<script setup>
import { context, start } from 'tone'
import { useSynth } from './synth'
import { notes } from '#/use/theory'
import { noteColor } from "#/use/colors";
import { reactive, computed } from 'vue';
import PitchTableCellInfo from './PitchTableCellInfo.vue'

const props = defineProps({
  pitch: { type: Number, default: 0 },
  octave: {
    default: 3,
    type: Number,
  }
});

const synth = useSynth(props.pitch, props.octave);

const dragOptions = reactive({
  filterTaps: true,
  preventWindowScrollY: true,
  delay: 0,
  eventOptions: {
    passive: false
  }
})

const dragHandler = (dragEvent) => {
  if (context.state == 'suspended') {
    start()
  }
  let { movement: [x, y], tap } = dragEvent
  if (!tap) {
    synth.vol += -y / 20
    if (synth.vol > 100) synth.vol = 100
    if (synth.vol < 0) synth.vol = 0

    synth.pan += x / 20

    if (synth.pan > 100) synth.pan = 100
    if (synth.pan < 0) synth.pan = 0
  } else {
    if (synth.active) {
      synth.vol = 0;
      synth.pan = 50
    } else {
      synth.vol = 50
    }

  }
}

const color = computed(() => noteColor(props.pitch, props.octave))

const textColor = computed(() => {
  // here's a nice algo for HEX colors https://codepen.io/cferdinandi/pen/Yomroj 
  if (Math.abs(props.octave + 2) * 8 > 40) {
    return "hsla(0,0%,0%," + (synth.active ? "1" : "0.8") + ")";
  } else {
    return "hsla(0,0%,100%," + (synth.active ? "1" : "0.8") + ")";
  }
});

</script>

<template lang="pug">
.cell(
  v-drag="dragHandler",
  :drag-options="dragOptions",
  :style="{backgroundColor: color, color: textColor }", 
  :class="{ active: synth.active }")
  .absolute.w-full.h-full.top-0.left-0.bottom-0(v-show="synth.vol > 0")
    .volume(
      :style="{ height: synth.vol + '%' }"
    ) 
  .absolute.h-full.top-0.left-0.right-0.text-center(v-show="synth.pan != 50")
    .pan.absolute.bg-gray-100.h-full.m-auto(
      :style="{ left: synth.pan + '%' }"
    ) 

  pitch-table-cell-info(
    :name="notes[pitch]",
    :hz="synth.freq", 
    :octave="octave")
</template>

<style lang="postcss" scoped>
.cell {
  @apply relative opacity-90 flex flex-col p-1 flex-1 cursor-pointer select-none;
  touch-action: none;
  transition: all 100ms ease;
  min-width: 2em;
  min-height: 4em;
}

.cell.active,
.cell:active {
  @apply opacity-100;
}

.volume {
  mix-blend-mode: multiply;
  @apply absolute border-t bg-gray-500 w-full bottom-0;
}

.pan {
  left: 50%;
  width: 1px;
  transform: translateX(-2.5px);
}
</style>