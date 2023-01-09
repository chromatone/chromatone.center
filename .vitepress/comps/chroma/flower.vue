<script setup>
import { notes } from '#/use/theory'
import { defaultScheme, scheme, noteColor } from '#/use/colors'
import { getCircleCoord } from '#/use/calculations'
import { midi, playKey } from '#/use/midi'
import { globalScale } from '#/use/chroma'
import { colord } from "colord";
import { useClipboard, watchThrottled } from '@vueuse/core'

const props = defineProps({
  size: { type: Number, default: 1000 },
  pad: { type: Number, default: 50 },
})

const flower = computed(() => {
  return notes.map((note, n) => {
    return {
      note: note,
      pitch: n,
      coord: coord(n, 0.42),
      middle: coord(n, 0.28),
      inside: coord(n, 0.15),
    }
  })
})

const midiNotes = computed(() => {
  return new Array(127).fill(null).map((c, n) => (n + 3) % 12)
})

function coord(n = 0, q = 0.5) {
  return getCircleCoord(n % 12, 12, props.size * q, 0)
}

const pressed = ref()

function keyPlay(pitch, event, off, velocity) {
  pressed.value = !off
  playKey(flower.value[pitch].note, pitch >= 3 ? 0 : -1, off, velocity)
}

const { copy, copied } = useClipboard()

const loaded = ref('')
const err = ref(null)

watchThrottled(loaded, l => {
  try {
    let arr = JSON.parse(l)
    if (arr.length == 12 && arr.every(c => colord(c).isValid())) {
      scheme.custom = arr
      loaded.value = ''
      scheme.customize = false
    } else {
      throw ('Invalid scheme')
    }
  } catch (error) {
    err.value = true
    setTimeout(() => err.value = null, 1000)
    console.error('Loaded color scheme is not valid')
  }
})

</script>

<template lang="pug">
.max-w-150.mx-auto.w-full.relative.flex.items-center.flex-col.justify-center
  button.absolute.text-xl.opacity-30.hover-opacity-100.hover-scale-110.transition.cursor-pointer.transform(
    v-tooltip.bottom="'Customize colors'"
    aria-label="Customize colors sitewide"
    @click="scheme.customize = !scheme.customize"
    :class="{customize: scheme.customize}"
    )
    .i-la-cog

  button.absolute.opacity-50.hover-opacity-100.transition.cursor-pointer.bottom-0.left-5.flex.items-center.gap-1.bg-light-100.dark-bg-dark-100.rounded-xl.p-2.shadow-lg(
    v-tooltip.bottom="'Copy custom schema'"
    aria-label="Copy custom schema"
    @click="copy(JSON.stringify(scheme.custom))"
    :class="{customize: copied}"
    v-if="scheme.customize"
    )
    .i-la-copy.text-xl
    .p-0 COPY
  .absolute.opacity-50.hover-opacity-100.transition.bottom-0.right-5.flex.items-center.gap-1.bg-light-100.dark-bg-dark-100.rounded-xl.shadow-lg(
    v-tooltip.bottom="'Paste custom schema'"
    aria-label="Paste custom schema"
    v-if="scheme.customize"
    )
    .i-la-paste.text-xl.absolute.ml-1
    input.w-25.p-2.pl-8.rounded-xl(
      v-model="loaded" placeholder="PASTE"
      :style="{backgroundColor: err ? 'red' : ''}"
      )
  svg.w-full.min-w-full(
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
      g.keys(v-for="(note, pitch) in flower" :key="note")
        g.key.cursor-pointer(
          @mousedown="keyPlay(pitch, $event);"
          @mouseup="keyPlay(pitch, $event, true)"
          @touchstart.prevent.stop="keyPlay(pitch, $event)"
          @touchend.prevent.stop="keyPlay(pitch, $event, true)"
          @mouseleave="keyPlay(pitch, $event, true)"
          )
          g.petal(
            :transform="`rotate(${pitch * 30}) translate(2,-120) `"
            :fill="note.note.length > 1 ? '#222' : '#eee'"
            :opacity="midi.activeChroma[pitch] ? 1 : 0.9"
            style="transition: all 100ms ease-out"
            filter="url(#shadow)"
            ) 
            path(
              :d="`M 0,0 a 30,30,0,0,0,25,-20 l 70 -260 a 120,120,0,0,0,2,-20 a 100,100,0,0,0,-200,0 a 120,120,0,0,0,2,20 l 70,260 a 30,30,0,0,0,25,20z`"
              )
          g()
            g.note.select-none(
              stroke-width="4"
              stroke-linecap="round"
              v-if="scheme.custom[pitch]!=defaultScheme[pitch]"
              :transform="`translate(${note.inside.x}, ${note.inside.y})`"
              @click="scheme.custom[pitch]=defaultScheme[pitch]"
              )
              circle.transition(:fill="defaultScheme[pitch]" r="20" :opacity="scheme.customize ? 1 : 0.1" )
              g(
                stroke-width="4"
                stroke-linecap="round"
                )
                line(stroke="black" x1="-10" y1="-10" x2="10" y2="10")
                line(stroke="black" x1="10" y1="-10" x2="-10" y2="10")
            g.note.select-none(
              v-if="scheme.customize"
              :transform="`translate(${note.middle.x-36}, ${note.middle.y-36})`"
              )
              foreignObject(x="10" y="10" width="100" height="100")
                input.h-30.w-30.rounded-xl(type="color" v-model="scheme.custom[pitch]")
          g.note.select-none(

            :transform="`translate(${note.coord.x}, ${note.coord.y})`"
            )
            circle(
              style="transition: all 100ms ease-out"
              :fill="noteColor(pitch, midi.activeChroma[pitch] ? 4 : 2)"
              :r="size / 12"
              )
            text.transition(
              :font-size="size / 20"
              font-weight="bold"
              :fill="colord(noteColor(pitch, midi.activeChroma[pitch] ? 4 : 2)).isDark() ? 'white' : 'black'"
              )
              tspan(
                dy="5"
                text-anchor="middle" 
                dominant-baseline="middle" 
                ) {{ note.note }}

      g.spiral.pointer-events-none
        transition-group(name="fade")
          g.interval(v-for="(bool, note) in midi.activeNotes" :key="note")
            transition-group(name="fade")
              line(
                v-for="(bool2, note2) in midi.activeNotes" :key="note2"
                :x1="coord((note-9)%12, note/700+0.145).x" 
                :y1="coord((note-9)%12, note/700 +0.145).y" 
                :x2="coord((note2-9)%12, note2/700+0.145).x" 
                :y2="coord((note2-9)%12, note2/700 +0.145).y" 
                :stroke="colord(scheme.custom[(note-9)%12]).mix(scheme.custom[(note2-9)%12]).toHex()"
                stroke-width="10"
                :style="{filter: `drop-shadow(0px 0px 4px ${colord(scheme.custom[(note-9)%12]).mix(scheme.custom[(note2-9)%12]).alpha(0.5).toHex()}`}"
              )
        transition-group(name="fade")
          g.note(v-for="(bool, note) in midi.activeNotes" :key="note")
            circle(
              style="transition: all 100ms ease-out"
              :cx="coord((note-9)%12, note/700+0.145).x" 
              :cy="coord((note-9)%12, note/700 +0.145).y" 
              :fill="scheme.custom[(note-9)%12]"
              :r="12" 
            )          
        
</template>

<style scoped lang="postcss">
button.customize {
  @apply transform scale-150;
}

input[type="color"] {
  width: 3rem;
  height: 3rem;
  padding: .5rem;
  background-color: transparent;
  border: 0;
  border-radius: 100%;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}
</style>