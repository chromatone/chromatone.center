<script setup>
import toColor from 'color-spectrum'
import { pitchFreq, pitchColor } from '#/use'
import { useClamp } from '@vueuse/math';
import { useDrag } from '@vueuse/gesture';
import { computed, ref } from 'vue';

const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A']

const box = {
  width: 1200,
  height: 100,
}

const pad = {
  top: 130,
  right: 10,
  bottom: 30,
  left: 10
}

const baseFreq = useClamp(440, 400, 460)

function tHzToNM(frequencyTHz) {
  const speedOfLight = 299792458 * 1e9; // nm/s
  return speedOfLight / (frequencyTHz * 1e12);
}

const count = 500
const range = [400, 1000]

const freqs = computed(() => notes.map((name, pitch) => {
  const freqM4 = pitchFreq(pitch, -6, baseFreq.value)
  const freq0 =
    pitchFreq(pitch, 2, baseFreq.value)
  const freq = pitchFreq(pitch, 3, baseFreq.value)
  const freq40 = (freq * Math.pow(2, 40)) / 1_000_000_000_000
  return {
    name,
    pitch,
    freqM4,
    freq0,
    freq,
    freq40,
    color: toColor(tHzToNM(freq40))
  }
}))

const spectrum = ref()

useDrag(ev => {
  if (!ev.dragging) return
  const delta = ev.delta[0]
  baseFreq.value += delta / 10
}, {
  domTarget: spectrum,

})

</script>

<template lang='pug'>
svg.w-full.cursor-grab.active-cursor-grabbing.select-none(
  title="Drag left to right to adjust the base frequency of the A4 note. Double click to reset back to 440 Hz."
  ref="spectrum"
  version="1.1",
  baseProfile="full",
  :viewBox="`${-pad.left} ${-pad.top} ${box.width + pad.left + pad.right} ${box.height + pad.top + pad.bottom}`",
  xmlns="http://www.w3.org/2000/svg",
  font-family="Commissioner, sans-serif"
  font-size="14px"
  text-anchor="middle",
  dominant-baseline="middle"
  @dblclick="baseFreq = 440"
  )
  g.spectrum
    rect(
      :transform="`translate(${(box.width / count) * p} 0)`"
      v-for="(pane, p) in count" :key="pane"
      :fill="toColor(tHzToNM(range[0] + (range[1] - range[0]) * p / count))" 
      :height="box.height" 
      :width="box.width / count" 
      )

  g(text-anchor="start" :transform="`translate(5 ${-115})`")
    text(fill="currentColor")
      tspan -5th Octave
      tspan(dy="25" x="0") 3rd Octave
      tspan(dy="25" x="0") 4th Octave
      tspan(dy="25" x="0") 44th Octave

  g(
    v-for="note in freqs" :key="note"
    :transform="`translate(${box.width * ((note.freq40 - range[0]) / (range[1] - range[0]))} 0)`"
    )

    line(:y1="-20" :y2="105" stroke="currentColor")

    g.note(:transform="`translate(0 ${box.height / 2})`")
      circle(:r="20" :cy="-2" :fill="pitchColor(note.pitch, 4)")
      text {{ note.name }}

    text(:y="-115" fill="currentColor")
      tspan(x="0" :class="{ 'font-bold': note.pitch == 3 }") {{ note.freqM4.toFixed(3) }}
      tspan(dy="25" x="0" :class="{ 'font-bold': note.pitch == 3 }") {{ note.freq0.toFixed(1) }}
      tspan(dy="25" x="0" :class="{ 'font-bold': note.pitch == 0 }") {{ note.freq.toFixed(1) }}
      tspan(dy="25" x="0") {{ note.freq40.toFixed(1) }}
      tspan(y="120" x="0") {{ tHzToNM(note.freq40).toFixed(1) }}

    circle(:r="5" :cy="-20" :fill="note.color")

  g(text-anchor="start" :transform="`translate(10 0})`")
    text(fill="currentColor")
      tspan.font-bold(x="5" :y="-15") Frequency, Hz
      tspan(x="5" y="15") {{ range[0] }} Hz
      tspan(text-anchor="end" :x="box.width - 5" y="15") {{ range[1] }} Hz
      tspan(x="5" :y="box.height - 15") {{ tHzToNM(range[0]).toFixed(1) }} nm
      tspan(text-anchor="end" :x="box.width - 5" :y="box.height - 15") {{ tHzToNM(range[1]).toFixed(1) }} nm
      tspan.font-bold(x="5" :y="box.height + 20") Wavelength, nm
      
</template>