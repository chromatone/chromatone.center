<script setup>
import { Frequency } from 'tone'
import { pitchFreq } from '#/use/calculations'
import { noteColor } from '#/use/colors'
import { playNote, stopNote } from '#/use/chroma'
import { computed, ref } from 'vue';
import { useMidi } from '#/use'
const { midi } = useMidi()

const props = defineProps({
  note: { type: Object, default: () => { } },
  r: { type: Number, default: 10 },
  pressed: { type: Boolean, default: false },
  available: { type: Boolean, default: false },
  tonic: { type: Number, default: 0 },
});

defineEmits(['update:pressed'])

const playing = ref(false)

const noteName = computed(() => {
  let octave = props.tonic > props.note.pitch ? 3 : 2
  return Frequency(pitchFreq(props.note.pitch, octave)).toNote()
})

function attack() {
  playing.value = true
  playNote(noteName.value)
}

function release() {
  playing.value = false
  stopNote(noteName.value)
}

</script>

<template lang="pug">
g.cursor-pointer
  circle.transition-all.duration-50(
    :r="r", 
    :cx="0", 
    :cy="0",  
    :stroke-width="tonic == note.pitch ? 4 : available ? 2 : 0",
    stroke="white"
    :fill="noteColor(note.pitch, playing || midi.activeChroma?.[note.pitch] > 0 ? 5 : available ? 3 : 2, playing || midi.activeChroma?.[note.pitch] > 0 ? 1 : 0.4  )"
    @mousedown="attack()", 
    @touchstart="attack()",
    @mouseenter="pressed ? attack() : null"
    @mouseup="release()", 
    @mouseleave="release()", 
    @touchend="release()", 
    @touchcancel="release()")
  text(
    style="user-select: none;pointer-events: none;"
    font-size="22px"
    text-anchor="middle", 
    fill="white", 
    :x="0", 
    :y="8") {{ note.name }}
</template>

<style lang="postcss" scoped></style>