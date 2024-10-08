<script setup>
import { notes } from '#/use/theory'
import { defaultScheme, scheme, noteColor } from '#/use/colors'
import { getCircleCoord, rotateArray } from '#/use/calculations'
import { midi, midiAttack, midiRelease, playKey } from '#/use/midi'
import { globalScale } from '#/use/global'
import { useTuner } from '#/use/tuner'
import { colord } from "colord";
import { useClipboard, watchThrottled } from '@vueuse/core'
import { computed, onMounted, ref, shallowRef, reactive, watch, nextTick } from 'vue'

const props = defineProps({
  letters: { type: Boolean, default: true },
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

const tuner = shallowRef()
onMounted(() => {
  tuner.value = useTuner()
})

function getAmmount(ammount) {
  return ammount > tuner.value.tuner.chromaAvg ? tuner.value.tuner.note.silent ? 0 : ammount : 0
}

const midiNotes = computed(() => {
  return new Array(127).fill(null).map((c, n) => (n + 3) % 12)
})

function coord(n = 0, q = 0.5) {
  return getCircleCoord(n % 12, 12, props.size * q, 0)
}

function keyPlay(pitch, event, off, velocity) {
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

const octaves = ref(4)
const startOctave = ref(1)
const box = { pad: 2, r: props.size / 2 }
const svg = ref()

const touches = reactive({})

const voices = computed(() => {
  const list = {}
  for (let t in touches) {
    const { angle, distance } = touches[t]
    const pitch = Math.ceil((angle - 15) / 30) % 12
    const octave = Math.floor((1 - distance) * octaves.value + startOctave.value - 2)
    const num = (octave + 4) * 12 + pitch - 3
    list[t] = { pitch, octave, num }
  }
  return list
})

function getPoint({ clientX, clientY }) {
  const point = svg.value.createSVGPoint()
  point.x = clientX
  point.y = clientY
  let { x, y } = point.matrixTransform(svg.value.getScreenCTM().inverse())
  return {
    x,
    y,
    angle: 180 * (Math.PI - Math.atan2(x, y)) / Math.PI,
    distance: Math.hypot(x, y) / box.r,
  }
}

function handleMouse(ev) {
  if (ev.type == 'mousedown') {
    touches['mouse'] = getPoint(ev)
  } else if (['mouseup', 'mouseleave', 'mouseout'].includes(ev.type)) {
    delete touches['mouse']
  } else if (touches['mouse'] && ev.type == 'mousemove') {
    touches['mouse'] = getPoint(ev)
  }
}

function handleTouch(ev) {
  for (let touch of ev.changedTouches) {
    if (['touchend', 'touchcancel'].includes(ev.type)) {
      delete touches[touch.identifier]
    } else {
      touches[touch.identifier] = getPoint(touch)
    }
  }
}

watch(voices, (vs, prev) => {
  for (let v in vs) {
    if (vs[v]?.num != prev[v]?.num) {
      let offset = vs[v]?.octave - startOctave.value + (vs[v]?.pitch >= 3 ? 1 : 0)
      console.log(notes[vs[v]?.pitch], offset)
      playKey(notes[vs[v]?.pitch], offset)
      midiAttack({ number: vs[v]?.num })
    }
  }
  nextTick(() => {
    for (let p in prev) {
      if (prev[p]?.num != vs[p]?.num) {
        playKey(notes[prev[p]?.pitch], prev[p]?.octave - startOctave.value + (prev[p]?.pitch >= 3 ? 1 : 0), true)
        midiRelease({ number: prev[p]?.num })
      }
    }
  })


})

</script>

<template lang="pug">
.max-h-80vh.relative.flex.items-center.flex-col.justify-center
  button.absolute.opacity-20.hover-opacity-100.transition.cursor-pointer.top-4.left-4.flex.items-center.gap-1.bg-light-100.dark-bg-dark-100.rounded-xl.p-2.shadow-lg(
    v-tooltip.right="'Start input audio analysis'"
    aria-label="Start input audio analysis"
    @click="tuner?.init()"
    v-if="!tuner?.tuner?.initiated"
    )
    .i-la-microphone.text-xl

  button.absolute.opacity-20.hover-opacity-100.transition.cursor-pointer.top-4.right-4.flex.items-center.gap-1.bg-light-100.dark-bg-dark-100.rounded-xl.p-2.shadow-lg(
    @click="scheme.customize = !scheme.customize"
    v-tooltip.left="'Customize colors'"
    aria-label="Customize colors sitewide"
    )
    .i-la-cog.text-xl

  button.absolute.opacity-50.hover-opacity-100.transition.cursor-pointer.bottom-0.left-5.flex.items-center.gap-1.bg-light-100.dark-bg-dark-100.rounded-xl.p-2.shadow-lg(
    v-tooltip.bottom="'Copy custom schema'"
    aria-label="Copy custom schema"
    @click="copy(JSON.stringify(scheme.custom))"
    :class="{ customize: copied }"
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
      :style="{ backgroundColor: err ? 'red' : '' }"
      )

  svg.w-full.min-w-full(
    ref="svg"
    version="1.1",
    baseProfile="full",
    :viewBox="`${-pad - size / 2} ${-pad - size / 2} ${size + 2 * pad} ${size + 2 * pad}`",
    xmlns="http://www.w3.org/2000/svg",
    text-anchor="middle" 
    dominant-baseline="middle" 
    @touchstart.passive="handleTouch"
    @touchmove.passive="handleTouch"
    @touchend.passive="handleTouch"
    @touchcancel.passive="handleTouch"
    @mouseenter.passive="handleMouse"
    @mousemove.passive="handleMouse"
    @mousedown.passive="handleMouse"
    @mouseup.passive="handleMouse"
    @mouseleave.passive="handleMouse"
    )
    defs
      filter#shadow
        feDropShadow(
          dx="0"
          dy="0"
          stdDeviation="8"
          flood-opacity="0.3"
        )
      filter#blur(
        x="-1" 
        y="-1" 
        width="300" 
        height="300")
        feGaussianBlur(i
        n="SourceGraphic" 
        :stdDeviation="20")
      filter#blur-less(
        x="-1" 
        y="-1" 
        width="300" 
        height="300")
        feGaussianBlur(i
        n="SourceGraphic" 
        :stdDeviation="15")


    g.keys(v-for="(note, pitch) in flower" :key="note")
      g.key.cursor-pointer(
        )
        g.petal(
          :transform="`rotate(${pitch * 30}) translate(2,-120) `"
          :fill="note.note.length > 1 ? '#222' : '#eee'"
          :opacity="midi.activeChromaMidi[pitch] ? 1 : 0.9"
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
            v-if="scheme.custom[pitch] != defaultScheme[pitch]"
            :transform="`translate(${note.inside.x}, ${note.inside.y})`"
            @click="scheme.custom[pitch] = defaultScheme[pitch]"
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
            :transform="`translate(${note.middle.x - 36}, ${note.middle.y - 36})`"
            )
            foreignObject(x="10" y="10" width="100" height="100")
              input.h-30.w-30.rounded-xl(type="color" v-model="scheme.custom[pitch]")
        g.note.select-none(
          :transform="`translate(${note.coord.x}, ${note.coord.y})`"
          )
          circle(
            style="transition: all 100ms ease-out"
            :fill="noteColor(pitch, midi.activeChromaMidi[pitch] ? 4 : 3, 1, globalScale.isIn(notes[pitch]) ? 1 : 0.3)"
            :r="size / 12 - (pitch == globalScale.tonic ? -10 : globalScale.isIn(notes[pitch]) ? 0 : 20)"
            )
          g(v-if="tuner?.tuner?.initiated")
            circle(
              style="transition: all 80ms ease-out"
              :fill="noteColor(pitch, 7, 2, getAmmount(tuner.tuner.aChroma[pitch]))"
              :r="size / 12"
              filter="url(#blur)"
              )
          text.transition(
            v-if="letters"
            :font-size="size / 20"
            font-weight="bold"
            :fill="!midi.activeChromaMidi[pitch] ? 'white' : 'black'"
            )
            tspan(
              dy="5"
              text-anchor="middle" 
              dominant-baseline="middle" 
              ) {{ note.note }}

    g.spiral.pointer-events-none
      g.interval(v-for="(bool, note) in midi.activeNotes" :key="note")
        transition-group(name="fade")
          line(
            v-for="(bool2, note2) in midi.activeNotes" :key="note2"
            :x1="coord((note - 9) % 12, (127 - note) / 700 + 0.145).x" 
            :y1="coord((note - 9) % 12, (127 - note) / 700 + 0.145).y" 
            :x2="coord((note2 - 9) % 12, (127 - note2) / 700 + 0.145).x" 
            :y2="coord((note2 - 9) % 12, (127 - note2) / 700 + 0.145).y" 
            :stroke="colord(noteColor(note - 9, 2)).mix(noteColor(note2 - 9, 2)).toHex()"
            stroke-width="20"
            stroke-linecap="round"
            :style="{ filter: `drop-shadow(0px 0px 4px ${colord(noteColor(note - 9, 3)).mix(noteColor(note2 - 9, 3)).alpha(0.5).toHex()}` }"
            )
      //- transition-group(name="fade")
        g.note(v-for="(bool, note) in midi.activeNotes" :key="note")
          circle(
            style="transition: all 100ms ease-out"
            :cx="coord((note - 9) % 12, note / 700 + 0.145).x" 
            :cy="coord((note - 9) % 12, note / 700 + 0.145).y" 
            :fill="scheme.custom[(note - 9) % 12]"
            :r="12" 
            )          
    g.controls
      g.tuner.transition(
        v-if="tuner?.tuner?.initiated"
        aria-label="Calculated fundamental frequency"
        )
        circle.transition(
          filter="url(#blur)"
          style="transition:all 500ms ease"
          r='32' 
          cy="0"
          :fill="!tuner.tuner.note?.silent && tuner.tuner.initiated ? noteColor((tuner.tuner.note.value + 3) % 12, 4) : 'transparent'")
        text.opacity-50.select-none(
          v-if="tuner?.tuner?.initiated"
          y="-67"
          v-show="!tuner.tuner.note?.silent"
          font-size="28"
          fill="currentColor"
          ) {{ tuner.tuner.note.name }}
    g.chord.cursor-pointer(
      v-tooltip.top="midi.guessChords.length > 1 && 'or ' + midi.guessChords.slice(1).join(', ') || copied ? 'Copied!' : 'Click to copy'"
      :aria-label="'Guessed chord: ' + midi.guessChords[0]"
      @click="copy(midi.guessChords[0])"
      v-if="midi.guessChords[0]"
      )
      rect(
        fill="#0001"
        x="-100" 
        y="-32" 
        width="200" 
        height="70"
        rx="10"
        )
      text(
        y="6"
        font-size="40"
        fill="currentColor"
      ) {{ midi.guessChords[0] }}
    g.center(v-else)
      circle(
        r="3" 
        fill="currentColor"
        )
</template>

<style scoped lang="postcss">
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