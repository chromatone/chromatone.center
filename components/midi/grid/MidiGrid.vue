<script setup>
import { noteColor } from '#/use/colors';
import { useMidi } from '#/use/midi';
import { notes } from '#/use/theory';
import { computed, ref, watch } from 'vue';
import { useGesture } from '@vueuse/gesture';
import { globalScale } from '#/use/global';
import { useClamp, useRound } from '@vueuse/math'
import { useStorage } from '@vueuse/core'
import { Interval, Note, ScaleType } from 'tonal'

import { playNote, stopNote } from '#/use/midi'

const props = defineProps({
  width: { type: Number, default: 900 },
  height: { type: Number, default: 400 },
  controlOffset: { type: Number, default: 100 },
  slotOffset: { type: Number, default: 0 }
})

const { activeNotes } = useMidi()

const { roundBegin: begin, roundEnd: end, beginControl, endControl, keys: rawKeys } = useRange()

const svg = ref()
const area = ref()

const pressed = ref(false)

useGesture({
  onPointerdown(ev) { pressed.value = true },
  onPointerleave(ev) { pressed.value = false },
  onPointercancel(ev) { pressed.value = false },
  onPointerup(ev) { pressed.value = false }
}, {
  domTarget: svg,
})

const tonicControl = ref()
const tonicCents = ref(globalScale.tonic * 100)

watch(tonicCents, cents => {
  globalScale.tonic = Math.round(((cents / 100) % 12 + 12) % 12)
})

useGesture({
  onDrag(ev) {
    ev.event.preventDefault()
    tonicCents.value += ev.delta[0]
  },
  onWheel(ev) {
    ev.event.preventDefault()
    tonicCents.value -= ev.velocities[0]
  }
}, {
  domTarget: tonicControl,
  eventOptions: { passive: false }
})

const scaleControl = ref()
const scaleCurrent = useClamp(useStorage('midikeys-scale', 1), 1, ScaleType.all().length - 1)

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

const scales = ScaleType.all()

const scaleChroma = computed(() => {
  let num = Math.round(scaleCurrent.value)
  return scales[num]
})

watch(scaleChroma, scale => {
  globalScale.chroma = scale.chroma
})

const filterScale = useStorage('filter-keys', true)

const keys = computed(() => filterScale.value ? rawKeys.value.filter(key => {
  return globalScale.isIn(notes[(key + 3) % 12])
}) : rawKeys.value)


function useRange() {

  const begin = useClamp(useStorage('midi-grid-begins', 2), 0, 6)
  const end = useClamp(useStorage('midi-grid-ends', 5), () => begin.value + 1, 7)
  const roundBegin = useRound(begin)
  const roundEnd = useRound(end)
  const beginControl = ref()
  const endControl = ref()


  const keys = computed(() => {
    const arr = Array(roundEnd.value + 1 - roundBegin.value).fill(0).map((el, i) => i + roundBegin.value)
    return arr
  })

  useGesture({
    onDrag(ev) {
      ev.event.preventDefault()
      let val = begin.value + ev.delta[0] / 5
      if (val + 1 <= end.value) begin.value = Math.round(val)
    },
    onWheel(ev) {
      ev.event.preventDefault()
      let val = begin.value - ev.velocities[0] / 5
      if (val + 1 <= end.value) begin.value = Math.round(val)
    }
  }, {
    domTarget: beginControl,
    eventOptions: { passive: false }
  })

  useGesture({
    onDrag(ev) {
      ev.event.preventDefault()
      let val = end.value + ev.delta[0] / 5
      if (val > begin.value) end.value = val
    },
    onWheel(ev) {
      ev.event.preventDefault()
      let val = end.value - ev.velocities[0] / 5
      if (val - 1 > begin.value) end.value = val
    }
  }, {
    domTarget: endControl,
    eventOptions: { passive: false }
  })

  return { begin, end, roundBegin, roundEnd, beginControl, endControl, keys }
}

const getGrid = (chroma = "101011010101", tonic = 0, start = 2, end = 5) => Array(end - start).fill(1).map((_, o) => chroma.split('').map((_, n) => 21 + tonic + n + (o + start) * 12).filter((midi, m) => chroma.split('')[m] == 1))

const midiGrid = computed(() => getGrid(scaleChroma.value.chroma, globalScale.tonic, begin.value, end.value))

const currentNote = ref(null)

const touchPoints = new Map() // Map<number, number> (touchId -> noteId)

useGesture({
  onTouchstart: handleTouchStart,
  onTouchmove: handleTouchMove,
  onTouchend: handleTouchEnd,
  onTouchcancel: handleTouchEnd
}, {
  domTarget: area,
  eventOptions: { passive: false },
  triggerAllEvents: true
})

function handleTouchStart({ event }) {
  event.preventDefault()
  Array.from(event.changedTouches).forEach(touch => {
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    if (!element) return

    const noteElement = element.closest('.note-cell')
    if (!noteElement) return

    const note = parseInt(noteElement.dataset.note)
    touchPoints.set(touch.identifier, note)
    playNote(note)
  })
}

function handleTouchMove({ event }) {
  event.preventDefault()
  Array.from(event.changedTouches).forEach(touch => {
    const oldNote = touchPoints.get(touch.identifier)
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    if (!element) {
      if (oldNote !== undefined) {
        stopNote(oldNote)
        touchPoints.delete(touch.identifier)
      }
      return
    }

    const noteElement = element.closest('.note-cell')
    if (!noteElement) {
      if (oldNote !== undefined) {
        stopNote(oldNote)
        touchPoints.delete(touch.identifier)
      }
      return
    }

    const newNote = parseInt(noteElement.dataset.note)
    if (newNote !== oldNote) {
      if (oldNote !== undefined) {
        stopNote(oldNote)
      }
      touchPoints.set(touch.identifier, newNote)
      playNote(newNote)
    }
  })
}

function handleTouchEnd({ event }) {
  event.preventDefault()
  Array.from(event.changedTouches).forEach(touch => {
    const note = touchPoints.get(touch.identifier)
    if (note !== undefined) {
      stopNote(note)
      touchPoints.delete(touch.identifier)
    }
  })
}


</script>

<template lang='pug'>
svg.w-full.cursor-pointer.fullscreen-container.overflow-hidden.select-none.touch-none(
  :viewBox="`0 -${controlOffset + slotOffset} ${width} ${height + controlOffset}`"
  version="1.1",
  baseProfile="full",
  xmlns="http://www.w3.org/2000/svg",
  style="touch-action:none"
  ref="svg"
  )
  g.slot(:transform="`translate(0,${-slotOffset - controlOffset})`")
    slot
  g.offset(:transform="`translate(0,${-controlOffset})`")
    g.tonic(ref="tonicControl")
      rect(
        :height="controlOffset"
        :width="width / 4"
        :fill="noteColor(globalScale.tonic, 2, .8)"
        )
      text.font-bold.text-5xl(
        :x="width / 8"
        text-anchor="middle"
        :y="controlOffset * .75"
        ) {{ notes[(globalScale.tonic) % 12] }}
      line(
        v-for="(note, n) in notes"
        :transform="`translate(${(n / 12 + 1 / 24) * width / 4},0)`"
        :y2="16"
        stroke-width="6"
        stroke-linecap="round"
        :stroke="noteColor(n, 5, .4)"
        )
      line(
        :y2="20"
        stroke-width="8"
        stroke-linecap="round"
        :transform="`translate(${(((tonicCents / 1200) % 1 + 1) % 1) * width / 5 + width / 120},0)`"
        stroke="white"
        )

    g.scale(
      ref="scaleControl"
      :transform="`translate(${width / 4},0)`"
      )
      rect(
        :width="width * 2 / 4"
        :height="controlOffset"
        fill="#aaa"
        )
      text.text-3xl(
        :x="10"
        :y="controlOffset * .75"
        ) {{ scaleChroma.name }}
      line(
        v-for="(note, n) in ScaleType.all().length"
        :transform="`translate(${(n / ScaleType.all().length + 1 / (ScaleType.all().length)) * width * 2 / 4},0)`"
        :y2="36"
        :opacity="note == Math.round(scaleCurrent) ? 1 : .2"
        stroke-width="2"
        stroke-linecap="round"
        :stroke="`currentColor`"
        )
      line(
        :y2="20"
        stroke-width="8"
        stroke-linecap="round"
        :transform="`translate(${scaleCurrent / ScaleType.all().length * width * 2 / 4},0)`"
        stroke="white"
        )

    g.begin(
      ref="beginControl"
      :transform="`translate(${width * 6 / 8},0)`"
      )
      rect(
        :height="controlOffset"
        :width="width / 8"
        fill="#777"
        )
      text.font-bold.text-5xl.pointer-events-none(
        :x="10"
        :y="controlOffset * .75"
        ) {{ begin }}

    g.end(
      ref="endControl"
      :transform="`translate(${width * 7 / 8},0)`"
      )
      rect(
        :height="controlOffset"
        :width="width / 8"
        fill="#999"
        )
      text.font-bold.text-5xl.pointer-events-none(
        :x="width / 8 - 20"
        text-anchor="end"
        :y="controlOffset * .75"
        ) {{ end }}

  g.grid(ref="area")
    g.row(v-for="(octave, oct) in midiGrid" :key="oct")
      g.note-cell(
        v-for="(note, n) in octave" :key="note"
        :data-note="note"
        :transform="`translate(${n * width / midiGrid[0].length} ${height - (oct + 1) * (height / midiGrid.length)})`"
        @pointerdown.prevent="playNote(note)"
        @pointerenter="pressed ? playNote(note) : null"
        @pointerleave="pressed ? stopNote(note) : null"
        @pointerup.prevent="stopNote(note)"
        @pointercancel="stopNote(note)"
        )
        rect(
          :fill="noteColor(note - 9, null, 1, activeNotes[note] ? 1 : 0.4)"
          :height="height / midiGrid.length"
          :width="width / midiGrid[0].length"
          )
        text(
          dominant-baseline="middle"
          :y="25"
          :x="10"
          font-size="24"
          ) {{ Note.fromMidi(note) }} 
        text(
          dominant-baseline="middle"
          text-anchor="end"
          opacity=".3"
          :y="height / midiGrid.length - 10"
          :x="width / midiGrid[0].length - 10"
          ) 

          tspan() {{ note }} 

    g.intervals
      g.interval(
        v-for="(note, n) in midiGrid[0]" :key="note"
        :transform="`translate(${n * width / midiGrid[0].length + 10} 20)`"
        )
        text(text-anchor="end" font-weight="bold" :y="10" :x="width / midiGrid[0].length - 20") {{ Interval.fromSemitones(note - midiGrid[0][0]) }}
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

.note-cell {
  touch-action: none;
}
</style>