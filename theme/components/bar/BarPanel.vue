<script setup>
import { onClickOutside, onKeyDown } from '@vueuse/core';
import { ref } from 'vue';

const open = defineModel()

const panel = ref()

onClickOutside(panel, () => {
  open.value = false
})

onKeyDown('Escape', () => {
  open.value = false
})


</script>

<template lang='pug'>
transition-group(name="slide")
  button.cursor-pointer.bg-op-30.backdrop-blur-xl.dark-bg-op-70.fixed.bg-light-900.dark-bg-dark-200.p-3.z-1000(v-show="open" key="arrow")
    .i-la-angle-left.text-2xl
  .panel(
    ref="panel"
    v-show="open"
    key="panel"
    )
    slot
</template>

<style scoped lang="postcss">
.panel {
  @apply flex flex-col gap-4 transition fixed bg-light-200 bg-op-60 z-900 top-0 bottom-0 left-0 shadow-lg ml-12 overflow-scroll p-2 dark-bg-dark-200 dark-bg-op-60 max-w-340px pb-8 backdrop-blur;

  & h2 {
    @apply my-4 text-2xl
  }

}
</style>