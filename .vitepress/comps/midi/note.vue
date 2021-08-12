<template lang="pug">
.note(
  @mousedown="play()"
  @mouseup="stop()"
  @mouseleave="stop(true)"
  @touchstart.prevent="play()"
  @touchend="stop()"
  @mousemove="change()"
  @touchmove="change()"
  :style="{ backgroundColor: pitchColor(note?.pitch, note?.octA - 1, note?.velocity) }"
  ) {{ note?.name }} ({{ note?.number }})
</template>

<script setup>
import { ref } from 'vue'
import { pitchColor } from 'chromatone-theory'
const props = defineProps({
  note: Object,
  active: Boolean
});

const emit = defineEmits(['play', 'stop', 'update:active'])

const pressed = ref(false)

function play() {
  pressed.value = true
  emit('update:active', true)
  emit('play')
}

function stop(off = false) {
  if (pressed.value) {
    pressed.value = false
    if (!off) {
      emit('update:active', false)
    }
    emit('stop')
  }
}

function change() {
  if (props.active && !pressed.value) {
    pressed.value = true
    emit('update:active', true)
    emit('play')
  }
}
</script>

<style  scoped>
.note {
  @apply flex-1 p-2 m-1px transition-all duration-200 items-center flex justify-center  cursor-pointer text-light-100 select-none;
}
</style>