<script setup>
import { notes } from '@use/theory'
import { getCircleCoord, pitchColor } from '@use/calculations'
import { midi, playKey } from '@use/midi'

const props = defineProps({
  size: { type: Number, default: 1000 },
  pad: { type: Number, default: 50 },
})

const flower = computed(() => {
  return notes.map((note, n) => {
    return {
      note: note,
      coord: getCircleCoord(n, 12, props.size * 0.42, 0)
    }
  })
})

const pressed = ref()

function keyPlay(pitch, event, off, velocity) {
  pressed.value = !off
  playKey(flower.value[pitch].note, pitch >= 3 ? 0 : -1, off, velocity)
}

</script>

<template lang='pug'>
svg.max-w-150.mx-auto(
  version="1.1",
  baseProfile="full",
  :viewBox="`${-pad} ${-pad} ${size + 2 * pad} ${size + 2 * pad}`",
  xmlns="http://www.w3.org/2000/svg",
  text-anchor="middle" 
  dominant-baseline="middle" 
  )
  defs
    filter#shadow
      feDropShadow(
        dx="0"
        dy="0"
        stdDeviation="8"
        flood-opacity="0.3"
      )
  g(:transform="`translate(${size / 2}, ${size / 2}) `")
    g.keys(v-for="(note, pitch) in flower" key="note")
      g.key.cursor-pointer(
        @mousedown="keyPlay(pitch, $event)"
        @mouseup="keyPlay(pitch, $event, true)"
        @touchstart.prevent.stop="keyPlay(pitch, $event)"
        @touchend.prevent.stop="keyPlay(pitch, $event, true)"
        @mouseleave="keyPlay(pitch, $event, true)"
      )
        g.petal(
          :transform="`rotate(${pitch * 30}) translate(0,-120) `"
          :fill="note.note.length > 1 ? '#222' : '#eee'"
          :opacity="midi.activeChroma[pitch] ? 1 : 0.9"
          style="transition: all 100ms ease-out"
          filter="url(#shadow)"
          ) 
          path(
            :d="`M 0,0 a 30,30,0,0,0,25,-20 l 70 -260 a 120,120,0,0,0,2,-20 a 100,100,0,0,0,-200,0 a 120,120,0,0,0,2,20 l 70,260 a 30,30,0,0,0,25,20z`"
            )

        g.note.select-none(
          :transform="`translate(${note.coord.x}, ${note.coord.y})`"
          )
          circle(
            style="transition: all 100ms ease-out"
            :fill="pitchColor(pitch, midi.activeChroma[pitch] ? 4 : 2)"
            :r="size / 12"
            )
          text(
            :font-size="size / 20"
            font-weight="bold"
            fill="white"
          )
            tspan(
              dy="5"
              text-anchor="middle" 
              dominant-baseline="middle" 
              ) {{ note.note }}

</template>