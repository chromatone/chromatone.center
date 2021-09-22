<template lang="pug">
g.cursor-pointer
  circle.transition-all.duration-400(
    @mousedown="attack()", 
    @touchstart="attack()",
    @mouseenter="pressed ? attack() : null"
    @mouseup="release()", 
    @mouseleave="release()", 
    @touchend="release()", 
    @touchcancel="release()"
    :r="r", 
    :cx="0", 
    :cy="0",  
    :strokeWidth="tonic == note.pitch ? 4 : 1",
    stroke="white"
    :fill="playing ? pitchColor(note.pitch, 4) : available ? pitchColor(note.pitch, 3) : pitchColor(note.pitch, 2, 0.4)")
  text(
    style="user-select: none;pointer-events: none;"
    font-size="22px"
    text-anchor="middle", 
    fill="white", 
    :x="0", 
    :y="8") {{ note.name }}
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Frequency } from 'tone'
import { pitchColor, pitchFreq } from 'chromatone-theory'
import { synthAttack, synthRelease } from '@use/synth.js'
import { playNote, stopNote } from '@use/theory.js'

const props = defineProps({
  note: Object,
  r: Number,
  pressed: Boolean,
  available: Boolean,
  tonic: Number,
});

const emit = defineEmits(['update:pressed'])

const playing = ref(false)

const noteName = computed(() => {
  let octave = props.tonic + 3 > props.note.pitch + 3 ? 4 : 3
  return Frequency(pitchFreq(props.note.pitch, octave)).toNote()
})

function attack() {
  playing.value = true
  playNote(noteName.value)
};

function release() {
  playing.value = false
  stopNote(noteName.value)
};

</script>

<style scoped>
</style>