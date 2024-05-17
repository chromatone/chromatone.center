<script setup>
import { useFullscreen } from '@vueuse/core'
import { ref, onMounted, nextTick, computed } from 'vue';

const props = defineProps({
  el: { type: Object, default: null }
})

const element = ref()
const full = ref()

onMounted(() => {
  nextTick(init)
})

function toggle() {
  init()
  full.value.toggle()
}

const supported = computed(() => full.value?.isSupported);

function init() {
  if (props.el) {
    element.value = props.el
  } else {
    element.value = document.getElementById('screen')
  }
  if (!element.value) element.value = document.getElementById('content')
  full.value = useFullscreen(element.value)
}



</script>

<template lang="pug">
button(
  aria-label="Fullscreen toggle"
  @click="toggle()"
  v-tooltip.left="'Toggle fullscreen'"
  )
  .i-la-expand
</template>

<style lang="postcss" scoped></style>