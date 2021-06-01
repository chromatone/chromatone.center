<template lang="pug">
g.cursor-pointer
  circle.transition-all.duration-400(
    @mousedown.stop.prevent="attack", 
    @touchstart.stop.prevent="attack",
    @mouseup.stop.prevent="release", 
    @mouseleave.stop.prevent="release", 
    @touchend.stop.prevent="release", 
    :r="r", 
    :cx="0", 
    :cy="0",  
    :strokeWidth="tonic == note.pitch ? 4 : 1",
    stroke="white"
    :fill="active ? pitchColor(note.pitch) : pitchColor(note.pitch, 2, 0.4)")
  text(
    style="user-select: none;pointer-events: none;"
    font-size="22px"
    text-anchor="middle", 
    fill="white", 
    :x="0", 
    :y="8") {{ note.name }}
</template>

<script setup>
import { defineProps, ref, computed } from 'vue'
import { Frequency } from 'tone'
import { pitchColor, pitchFreq } from 'chromatone-theory'
import { synthAttack, synthRelease } from '@use/synth.js'
import { midiOnce, midiAttack, midiRelease } from '@use/midi.js'

const props = defineProps({
  note: Object,
  r: Number,
  active: Boolean,
  tonic: Number,
});

const playing = ref(false)

const noteName = computed(() => {
  let octave = props.tonic + 3 > props.note.pitch + 3 ? 4 : 3
  return Frequency(pitchFreq(props.note.pitch, octave)).toNote()
})

function attack() {
  playing.value = true

  synthAttack(
    noteName.value
  )
  midiAttack(noteName.value)
};

function release() {
  playing.value = false
  let octave = props.tonic + 3 > props.note.pitch + 3 ? 4 : 3
  synthRelease(
    noteName.value
  )
  midiRelease(
    noteName.value
  )
};

</script>

<style scoped>
</style>