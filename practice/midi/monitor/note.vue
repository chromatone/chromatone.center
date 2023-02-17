<script setup>
import { noteColor } from "#/use/colors"
import { ref } from "vue";
const props = defineProps({
  note: { type: Object, default: () => { } },
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

<template lang="pug">
.note(
  @mousedown="play()"
  @mouseup="stop()"
  @mouseleave="stop(true)"
  @touchstart.prevent="play()"
  @touchend="stop()"
  @mousemove="change()"
  @touchmove="change()"
  :style="{ backgroundColor: noteColor(note.pitch, note.octA - 1, note.velocity) }"
  ) 
    .font-bold {{ note?._name }}{{ note?._accidental }} 
    .text-sm {{ note?.number }}
</template>

<style lang="postcss" scoped>
.note {
  @apply flex-1 gap-1 p-2 m-1px transition-all duration-200 ease-out items-center flex justify-center cursor-pointer text-light-100 select-none;
}
</style>