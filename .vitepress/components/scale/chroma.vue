<template lang="pug">
svg.my-4(viewBox="0 -60 1300 200")
  rect(
    x=0
    y=20
    rx="50"
    ry="50"
    width=1300
    height=100
    :fill="pitchColor(tonic, 3, 1, 0.1)"
  )
  text(
    font-size="2.5rem"
    x="40"
    y="-20"
    :fill="isDark ? 'white' : 'black'"
  ) {{ notes[tonic].name }} {{ title }} 


  la-star-solid.cursor-pointer(
    @click="$emit('star')"
    x="1235"
    y="-50"
    font-size="2rem"
    :color="fav ? 'gray' : 'gold'"
  )
  scale-note(
    v-for="(note,i) in scaleNotes"
    :key="i"
    @click="$emit('setTonic', note.pitch)"
    @mouseenter="scale.chroma[i] == 1 ? $emit('play', note.pitch) : null"
    :opacity="scale?.chroma[i] == 1 ? 1 : 0.2"
    :note="note"
    :i="i"
    :active="scale?.chroma[i] == 1",
    :tonic="tonic"
  )
  scale-note(
    @click="$emit('setTonic', notes[tonic].pitch)"
    @mouseenter="$emit('play', notes[tonic].pitch + 12)"
    opacity="1"
    :note="notes[tonic]"
    :i="12"
    :active="true",
    :tonic="tonic"
  )
    

</template>

<script setup>
import { defineProps, computed, defineEmit } from 'vue'
import { useDark } from '@vueuse/core'
import { pitchColor, notes } from 'chromatone-theory'
const props = defineProps({
  scale: Object,
  tonic: 0,
  title: String,
  fav: Boolean,
});

const isDark = useDark()

defineEmit(['setTonic', 'play', 'star']);

function rotate(arr, count = 1) {
  return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
};

const scaleChroma = computed(() => {
  return rotate(props.scale.chroma.slice(''), -props.tonic)
});

const scaleNotes = computed(() => {
  return rotate(notes, props.tonic)
});


</script>

<style  scoped>
</style>