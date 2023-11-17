<script setup>
import { noteColor } from '#/use/colors';
import { useMidi } from '#/use/midi';
import { notes } from '#/use/theory';
import { computed, ref } from 'vue';
import { useRange } from './useRange.js'
import { useGesture } from '@vueuse/gesture';
import { useSynth } from '#/use/synth';
import { Midi } from 'tone';

const width = ref(1200)
const height = ref(500)
const controlOffset = ref(50)

const { attack, release } = useSynth()

const { midi, midiAttack, midiRelease } = useMidi()

const { roundBegin: begin, roundEnd: end, beginControl, endControl, keys } = useRange()

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
  console.log(note)
  midiAttack({ number: note })
  attack(Midi(note).toFrequency())
}

function stopNote(note) {
  console.log(note, 'stop')
  midiRelease({ number: note })
  release(Midi(note).toFrequency())
}

</script>

<template lang='pug'>
p {{ pressed }}
svg.rounded.w-full.cursor-pointer.min-w-70vw.fullscreen-container.overflow-hidden#screen(
  :viewBox="`0 -${controlOffset} ${width} ${height}`"
  version="1.1",
  baseProfile="full",
  xmlns="http://www.w3.org/2000/svg",
  style="touch-action:none"
  ref="keyboard"
  )
  g.offset
    g.begin
      rect(
        ref="beginControl"
        :y="-controlOffset"
        :height="controlOffset"
        :width="width/2"
        :fill="noteColor(begin,null,midi.activeNotes[begin] ? 1 : 0.1)"
        )
      text.font-bold.text-2xl(
        :x="10"
        :y="-controlOffset/3"
        ) {{ notes[(begin)%12] }}{{ Math.floor((Math.round(begin)+3)/12)-1 }}
    g.end 
      rect(
        ref="endControl"
        :x="width/2"
        :y="-controlOffset"
        :height="controlOffset"
        :width="width/2"
        :fill="noteColor(end,null,midi.activeNotes[end] ? 1 : 0.1)"
        )
      text.font-bold.text-2xl(
        :x="width-10"
          text-anchor="end"
        :y="-controlOffset/3"
        ) {{ notes[(end)%12] }}{{ Math.floor((end+3)/12)-1 }}
  g.keys
    rect(
      v-for="(key,k) in keys" :key="key"
      :x="k*width/keys.length"
      :width="width/keys.length"
      :height="height"
      :fill="noteColor(key,null,midi.activeNotes[key] ? 1 : 0.1)"
      @mousedown="startNote(key)", 
      @mouseenter="pressed ? startNote(key) : null"
      @touchstart="startNote(key)", 
      @mouseleave="stopNote(key)", 
      @mouseup="stopNote(key)", 
      @touchend="stopNote(key)", 
      @touchcancel="stopNote(key)"
      )
</template>