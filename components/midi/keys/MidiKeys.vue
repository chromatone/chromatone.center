<script setup>
import { noteColor } from '#/use/colors';
import { useMidi } from '#/use/midi';
import { notes, scaleList } from '#/use/theory';
import { computed, ref, watch } from 'vue';
import { useRange } from './useRange.js'
import { useGesture } from '@vueuse/gesture';
import { globalScale } from '#/use/chroma';
import { useClamp } from '@vueuse/math'
import { useStorage } from '@vueuse/core'
import { intervals } from '#/use/theory';

const props = defineProps({
  width: { type: Number, default: 1200 },
  height: { type: Number, default: 500 },
  controlOffset: { type: Number, default: 100 },
  slotOffset: { type: Number, default: 0 }
})

const { midi, playKey } = useMidi()

const { roundBegin: begin, roundEnd: end, beginControl, endControl, keys: rawKeys } = useRange()

const keyboard = ref()
const pressed = ref(false)

useGesture({
  onPointerdown(ev) { pressed.value = true },
  onPointerleave(ev) { pressed.value = false },
  onPointercancel(ev) { pressed.value = false },
  onPointerup(ev) { pressed.value = false }
}, {
  domTarget: keyboard,
})

function startNote(note) {
  playKey(note - 7, 0, 0, globalScale.isIn(notes[(note) % 12]) ? 1 : 0.3)
}

function stopNote(note) {
  playKey(note - 7, 0, 1, 0)
}

const tonicControl = ref()
const tonicCents = ref(globalScale.tonic * 100)

watch(tonicCents, cents => {
  globalScale.tonic = Math.round(((cents / 100) % 12 + 12) % 12)
})

useGesture({
  onDrag(ev) {
    ev.event.preventDefault()
    tonicCents.value += ev.delta[0] * 5
  },
  onWheel(ev) {
    ev.event.preventDefault()
    tonicCents.value -= ev.velocities[0] * 5
  }
}, {
  domTarget: tonicControl,
  eventOptions: { passive: false }
})

const scaleControl = ref()
const scaleCurrent = useClamp(10, 1, scaleList.length - 1)

useGesture({
  onDrag(ev) {
    ev.event.preventDefault()
    scaleCurrent.value += ev.delta[0] / 5
  },
  onWheel(ev) {
    ev.event.preventDefault()
    scaleCurrent.value -= ev.velocities[0] / 5
  }
}, {
  domTarget: scaleControl,
  eventOptions: { passive: false }
})

const scaleChroma = computed(() => {
  let num = Math.round(scaleCurrent.value)
  return scaleList[num]
})

watch(scaleChroma, scale => {
  globalScale.chroma = scale.chroma
})

const filterScale = useStorage('filter-keys', true)

const keys = computed(() => filterScale.value ? rawKeys.value.filter(key => {
  return globalScale.isIn(notes[(key + 3) % 12])
}) : rawKeys.value)

</script>

<template lang='pug'>
svg.w-full.cursor-pointer.fullscreen-container.overflow-hidden.select-none.touch-none(
  :viewBox="`0 -${controlOffset+slotOffset} ${width} ${height + controlOffset}`"
  version="1.1",
  baseProfile="full",
  xmlns="http://www.w3.org/2000/svg",
  style="touch-action:none"
  ref="keyboard"
  )
  g.slot(
    :transform="`translate(0,${-slotOffset-controlOffset})`"
    )
    slot
  g.offset(  
    :transform="`translate(0,${-controlOffset})`"
    )



    g.tonic(
      ref="tonicControl"
      )
      rect(

        :height="controlOffset"
        :width="width/5"
        :fill="noteColor(globalScale.tonic,2,.8)"
        )
      text.font-bold.text-6xl(
        :x="width/10"
        text-anchor="middle"
        :y="controlOffset*.75"
        ) {{ notes[(globalScale.tonic)%12] }}
      line(
        v-for="(note,n) in notes"
        :transform="`translate(${(n/12 + 1/24)*width/5},0)`"
        :y2="16"
        stroke-width="2"
        stroke-linecap="round"
        :stroke="noteColor(n,5,.4)"
        )
      line.transition(
        :y2="20"
        stroke-width="8"
        stroke-linecap="round"
        :transform="`translate(${(globalScale.tonic/12)* width/5 +width/120},0)`"
        stroke="white"
        )


    g.scale(
      ref="scaleControl"
      :transform="`translate(${width/5},0)`"
      )
      rect(
        :width="width*2/5"
        :height="controlOffset"
        fill="#aaa"
        )
      text.text-4xl(
        :x="30"
        :y="controlOffset*.75"
        ) {{ scaleChroma.name }}
      line(
        v-for="(note,n) in scaleList.length"
        :transform="`translate(${(n/scaleList.length + 1/(scaleList.length))*width*2/5},0)`"
        :y2="36"
        :opacity="note == Math.round(scaleCurrent) ? 1:.2"
        stroke-width="2"
        stroke-linecap="round"
        :stroke="`white`"
        )
      line(
        :y2="20"
        stroke-width="8"
        stroke-linecap="round"
        :transform="`translate(${scaleCurrent/scaleList.length* width*2/5},0)`"
        stroke="white"
        )

      g.show(
        :transform="`translate(${width*2/5-50},10)`"
        @click="filterScale=!filterScale"
        )
        circle(
          :cy="controlOffset*.5"
          r="20"
          :fill="filterScale? 'black' : 'transparent'"
          :stroke="'black'"
          :stroke-width="4"
          )


    g.begin(
      ref="beginControl"
        :transform="`translate(${width*3/5},0)`"
      )
      rect(
        :height="controlOffset"
        :width="width/5"
        :fill="noteColor(begin+3,null,midi.activeNotes[begin] ? 1 : 0.1)"
        )
      text.font-bold.text-6xl(
        :x="10"
        :y="controlOffset*.75"
        ) {{ notes[(begin+3)%12] }}{{ Math.floor((Math.round(begin)+3)/12)-1 }}
      line.pointer-events-none(
        v-for="(note,n) in end"
        :transform="`translate(${((n)/(end))*width/5},0)`"
        :y2="16"
        opacity=".3"
        stroke-width="2"
        stroke-linecap="round"
        :stroke="`white`"
        )
      line(
        :y2="20"
        stroke-width="8"
        stroke-linecap="round"
        :transform="`translate(${(begin/end)* width/5},0)`"
        stroke="white"
        )


    g.end(
      ref="endControl"
      :transform="`translate(${width*4/5},0)`"
      )

      rect(
        :height="controlOffset"
        :width="width/5"
        :fill="noteColor(end+3,null,midi.activeNotes[end] ? 1 : 0.1)"
        )
      text.font-bold.text-6xl.pointer-events-none(
        :x="width/5-20"
        text-anchor="end"
        :y="controlOffset*.75"
        ) {{ notes[(end+3)%12] }}{{ Math.floor((end+3)/12)-1 }}

      line.pointer-events-none(
        v-for="(note,n) in Number(127-begin)"
        :transform="`translate(${((n)/(127-begin))*width/5},0)`"
        :y2="16"
        opacity=".3"
        stroke-width="2"
        stroke-linecap="round"
        :stroke="`white`"
        )
      line.pointer-events-none(
        :y2="20"
        stroke-width="8"
        stroke-linecap="round"
        stroke="white"
        :transform="`translate(${((end-begin)/(127-begin))* width/5},0)`"
        )

  g.keys
    g.key(v-for="(key,k) in keys" :key="key"
      :transform="`translate(${k*width/keys.length},0)`"
      text-anchor="middle",
      )

      rect(
        :width="width/keys.length"
        :height="height"
        :fill="noteColor(key+3, null, midi.activeNotes[key] ? 1 : 0.1,globalScale.isIn(notes[(key+3)%12]) ? 1 : .4)"
        @mousedown.prevent="startNote(key+3)", 
        @mouseenter="pressed ? startNote(key+3) : null"
        @touchstart.prevent="startNote(key+3)", 
        @mouseleave="stopNote(key+3)", 
        @mouseup.prevent="stopNote(key+3)", 
        @touchend="stopNote(key+3)", 
        @touchcancel="stopNote(key+3)"
        )

      circle.pointer-events-none(
        :r="globalScale.tonic == (key+3)%12 ? width/keys.length/3 : width/keys.length/8"
        :cx="width/keys.length/2"
        :cy="height-width/keys.length/2"
        :opacity="midi.activeNotes[key] ? 1 :.3"
        :fill="globalScale.isIn(notes[(key+3)%12]) ? 'white' : 'black'"
        )
      svg-ring(
        :cx="width/keys.length/2"
        :cy="height-width/keys.length/2"
        :radius=" width/keys.length/3 "
        :from="0"
        :opacity=".4"
        :to="30*((key+globalScale.tonic-9)%12)"
        :thickness="width/keys.length/5"
        :round="true"
        fill="white"
      )

      text.opacity-75.pointer-events-none(
        :x="width/keys.length/2"
        :y="height-width/keys.length*1.1"
        :font-size="width/keys.length*.5"
        ) {{ intervals[(key+3 -globalScale.tonic)%12] }}

      line.pointer-events-none(
        :x1="width/keys.length/2",
        :x2="width/keys.length/2"
        :y1="0"
        :y2="height"
        stroke-width="6"
        :opacity=".9"
        :stroke="midi.activeNotes[key] ? 'white' : noteColor(key+3, -1, 1,1)"
        v-if="globalScale.tonic == (key+3)%12"
        )

      text.opacity-75.pointer-events-none(
        :x="width/keys.length/2"
        :y="width/keys.length+10"
        :font-size="width/keys.length*.333"
        ) {{ key }}

      text.pointer-events-none(
        :fill="globalScale.isIn(notes[(key+3)%12]) ?  'black' : '#777e'"

        :y="width/keys.length/2+10"
        :x="width/keys.length/2"
        :font-size="width/keys.length*.5"
        :font-weight="globalScale.tonic == (key+3)%12 ? 'bold' : 'normal'"
        ) {{ notes[(key+3)%12] }}
</template>

<style scoped>
svg {
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -o-user-select: none;
  user-zoom: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  -webkit-user-callout: none;
  -webkit-user-select: none;
  -webkit-user-modify: none;
  -webkit-highlight: none;
}
</style>