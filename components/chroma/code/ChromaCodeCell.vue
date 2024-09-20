<script setup>
import { computed } from 'vue';
import { noteColor } from '#/use/colors';
import { intervals, notes } from '#/use/theory';

const props = defineProps({
  index: { type: Number, required: true },
  tonic: { type: Number, required: true },
  isActive: { type: Boolean, required: true }
});

const emit = defineEmits(['toggle']);

const cellColor = computed(() => {
  if (props.isActive) return noteColor((props.tonic + props.index) % 12);
  return "101101011010"[props.index] === '1' ? 'hsla(0,0%,100%,0.5)' : 'hsla(0,0%,10%,0.5)';
});

const opacity = computed(() => props.isActive ? 1 : 0.4);

const interval = computed(() => intervals[props.index % 12]);

const note = computed(() => notes[(props.tonic + props.index) % 12]);
</script>

<template lang="pug">
.flex.flex-col.items-center.justify-center.rounded.text-md.p-1.select-none.cursor-pointer(
  @pointerdown="$emit('toggle', index)"
  v-tooltip="note"
  :style="{ flex: '1 1 50px', backgroundColor: cellColor, opacity: opacity }"
) {{ interval }}
</template>