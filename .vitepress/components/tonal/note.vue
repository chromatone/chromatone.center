<template lang="pug">
g.cursor-pointer
  circle.transition-all.duration-400(
    @mousedown.stop.prevent="playNote", 
    @touchstart.stop.prevent="playNote",
    @mouseup.stop.prevent="stopNote", 
    @mouseleave.stop.prevent="stopNote", 
    @touchend.stop.prevent="stopNote", 
    :r="r", 
    :cx="0", 
    :cy="0",  
    :stroke-width="tonic == note.pitch ? 4 : 1",
    stroke="white"
    :fill="active ? pitchColor(note.pitch) : '#999'")
  text(
    style="user-select: none;pointer-events: none;"
    font-size="22px"
    text-anchor="middle", 
    fill="white", 
    :x="0", 
    :y="8") {{ note.name }}
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { pitchColor, pitchFreq } from 'chromatone-theory'
import { attack, release } from '@use/synth.js'

const props = defineProps({
  note: Object,
  r: Number,
  active: Boolean,
  tonic: Number,
});

const playing = ref(false)

function playNote() {
  playing.value = true
  let octave = props.tonic + 3 > props.note.pitch + 3 ? 4 : 3
  attack(
    pitchFreq(props.note.pitch, octave),
  )
};
function stopNote() {
  playing.value = false
  let octave = props.tonic + 3 > props.note.pitch + 3 ? 4 : 3
  release(
    pitchFreq(props.note.pitch, octave),
  )
};

</script>

<style scoped>
.tonic {
  stroke-width: 10px;
}
</style>