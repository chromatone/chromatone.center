<script setup>
import { midi, learnCC } from '#/use/midi'
import { reactive, ref, computed, watch } from 'vue'
import { useGesture } from '@vueuse/gesture'
import { useClamp } from '@vueuse/math'

const props = defineProps({
  max: { type: Number, default: 100 },
  min: { type: Number, default: 0 },
  step: { type: Number, default: 1 },
  param: { type: String, default: "param" },
  unit: { type: String, default: "" },
  fixed: { type: Number, default: 1 },
  cc: { type: Number, default: 0 },
  channel: { type: Number, default: 0 },
});

const model = defineModel({ default: 50 });

const state = reactive({
  internal: useClamp(0, 0, 100),
  initial: computed(() => ((model.value - props.min) / (props.max - props.min)) * 100)
});

const external = computed({
  get: () => Math.round(((state.internal / 100) * (props.max - props.min) + props.min) / props.step) * props.step,
  set: (val) => { state.internal = ((val - props.min) / (props.max - props.min)) * 100; }
});

watch(model, (newValue) => { external.value = newValue; }, { immediate: true });
watch(learnCC({ param: props.param, number: props.cc, channel: props.channel }), v => {
  state.internal = v * 100;
  model.value = external.value;
});

const knob = ref();

useGesture({
  onDrag: ({ delta: [x, y], dragging, shiftKey, event }) => {
    if (event) event.preventDefault();
    const diff = shiftKey ? 12 : event.type === 'wheel' ? -8 : 2;
    state.internal = useClamp(0, state.internal - y / diff + x / diff, 100);
    model.value = external.value;
  },
  onWheel: ({ delta: [x, y], event }) => {
    if (event) event.preventDefault();
    state.internal = useClamp(0, state.internal + y / 8 - x / 8, 100);
    model.value = external.value;
  }
}, {
  wheel: { preventWindowScrollY: true },
  eventOptions: { capture: false, passive: false },
  domTarget: knob
});

const r = 45;
const len = Math.PI * 2 * r - 50;
</script>

<template lang="pug">
.knob(
  ref="knob"
  @dblclick="state.internal = state.initial; model = external"
)
  .i-ph-arrows-horizontal.absolute.text-10px.top-14px.opacity-70
  svg(viewBox="0 0 100 120")
    g(stroke="currentColor")
      path(
        d="M25,90 a 45,45,1,1,1,50,0" 
        fill="none"
        stroke="#9996"
        stroke-width="8"
        stroke-linecap="round"
      )
      path(
        d="M25,90 a 45,45,1,1,1,50,0" 
        fill="none"
        :stroke="`hsla(${state.internal * 3.6}deg,70%,50%,0.8)`"
        stroke-width="12"
        stroke-linecap="round"
        :stroke-dasharray="len"
        :stroke-dashoffset="len - (len * (state.internal / 100))"
      )
      g(:transform="`translate(50,52.5) rotate(${state.internal * 2.9}) `")
        circle(stroke-width="2" fill="none" :r="38" opacity="0.6")
    g(transform="translate(50,50)" text-anchor="middle" dominant-baseline="middle" fill="currentColor")
      text.font-bold.text-2xl(:transform="`translate(0,${unit ? -3 : 5})`")
        slot
          tspan {{ external.toFixed(fixed) }}
      text(transform="translate(0,20)")
        tspan {{ unit }}
      text.font-bold(transform="translate(0,58)")
        tspan {{ param.toUpperCase() }}
</template>

<style lang="postcss" scoped>
.knob {
  @apply p-1 flex flex-col items-center cursor-grab active-cursor-grabbing min-w-16 rounded-lg max-w-18 text-center border-dark-100/50 dark-(border-light-100/50) cursor-pointer select-none relative overflow-hidden relative;
  touch-action: none;
}

.level {
  @apply border-t-1 bg-dark-50/40 border-dark-100 dark-(border-light-100 bg-light-100/40) absolute bottom-0 w-full;
}
</style>