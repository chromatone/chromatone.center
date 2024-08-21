<script setup>
import { useGesture } from '@vueuse/gesture';
import { computed, ref } from 'vue';

const props = defineProps({
  width: { type: Number, default: 60 },
  height: { type: Number, default: 20 },
  pad: { type: Number, default: 3 },
  title: { type: String, default: 'Envelope' }
})

const a = defineModel('a', { type: Number, default: 1 })
const d = defineModel('d', { type: Number, default: 1 })
const s = defineModel('s', { type: Number, default: 0.7 })
const r = defineModel('r', { type: Number, default: 1 })

const path = computed(() => `
M 0 ${props.height}
l ${(props.width / 4) * a.value / 10} ${-props.height}
l ${(props.width / 4) * d.value / 10} ${props.height * (1 - s.value)}
L ${props.width - (props.width / 2) * (r.value / 10)} ${props.height * (1 - s.value)}
L ${props.width} ${props.height}
`)

const attPan = ref();
const decPan = ref();
const susPan = ref();
const relPan = ref();

const attInt = interactionFactory(a)
const decInt = interactionFactory(d)
const susInt = interactionFactory(s, 0.01)
const relInt = interactionFactory(r)

const gestureOptions = {
  // drag: { preventWindowScrollY: true },
  wheel: { preventWindowScrollY: true },
  eventOptions: { capture: false, passive: false },
}

useGesture({
  onDrag: attInt,
  onWheel: attInt
}, {
  ...gestureOptions,
  domTarget: attPan
});

useGesture({
  onDrag: decInt,
  onWheel: decInt
}, {
  ...gestureOptions,
  domTarget: decPan
});

useGesture({
  onDrag: susInt,
  onWheel: susInt
}, {
  ...gestureOptions,
  domTarget: susPan
});

useGesture({
  onDrag: relInt,
  onWheel: relInt
}, {
  ...gestureOptions,
  domTarget: relPan
});

const active = ref(false)

function interactionFactory(param, scale = .1) {
  return function handleInteraction(ev) {
    const { delta: [x, y], dragging, wheeling, shiftKey, event } = ev
    if (event) event.preventDefault();
    active.value = dragging || wheeling;
    if (!active.value) return
    const diff = shiftKey ? 12 : event.type === 'wheel' ? -8 : 2;
    let step = y / diff - x / diff
    param.value += -step * scale
  }
}
</script>

<template lang='pug'>
svg.min-w-45.max-w-55.m-1.touch-none(
  ref="knob"
  version="1.1",
  baseProfile="full",
  :viewBox="`${-pad} ${-pad * 2} ${width + pad * 2} ${height + pad * 3}`",
  xmlns="http://www.w3.org/2000/svg",
  ) 
  rect(:width="width + pad * 2" :height="height + pad * 2" rx="2" :transform="`translate(${-pad} ${-pad})`" fill="transparent")

  text(text-anchor="start" :font-size="pad * 1.4" dominant-baseline="middle" fill="currentColor" :transform="`translate(0 ${-pad})`") {{ title }}

  g.numbers(text-anchor="middle" font-size="6" dominant-baseline="middle" fill="currentColor" :transform="`translate(0 ${height * .25})`" )
    text(:x="width / 8") {{ a.toFixed(2) }}
    text(:x="3 * width / 8") {{ d.toFixed(2) }}
    text(:x="5 * width / 8") {{ s.toFixed(2) }}
    text(:x="7 * width / 8") {{ r.toFixed(2) }}

  g.titles(text-anchor="middle" font-size="6" dominant-baseline="middle" fill="currentColor" :transform="`translate(0 ${height * .75})`" )
    text(:x="width / 8") ATT
    text(:x="3 * width / 8") DEC
    text(:x="5 * width / 8") SUS
    text(:x="7 * width / 8") REL

  path(fill="currentColor" fill-opacity="0.2" stroke="currentColor" :d="path" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5")

  g.levels.op-50(stroke="currentColor" stroke-linecap="round" stroke-width="0.5")
    line(:x2="width / 4" :transform="`translate(${0 * width / 4} ${height * (1 - a / 10)})`")
    line(:x2="width / 4" :transform="`translate(${1 * width / 4} ${height * (1 - d / 10)})`")
    line(:x2="width / 4" :transform="`translate(${2 * width / 4} ${height * (1 - s)})`")
    line(:x2="width / 4" :transform="`translate(${3 * width / 4} ${height * (1 - r / 10)})`")

  g.controls.op-50(stroke="currentColor" fill="transparent" stroke-dasharray="0.05 1" stroke-linecap="round" stroke-width="0.5")
    rect(ref="attPan" :width="width / 4" :height)
    rect(ref="decPan" :width="width / 4" :height :transform="`translate(${width / 4} 0)`")
    rect(ref="susPan" :width="width / 4" :height :transform="`translate(${width / 2} 0)`")
    rect(ref="relPan" :width="width / 4" :height :transform="`translate(${3 * width / 4} 0)`")
</template>