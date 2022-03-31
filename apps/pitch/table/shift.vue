<script setup>
import { state } from './state.js'

const props = defineProps({
  top: Boolean,
});

</script>

<template lang="pug">
.flex.text-2xl.text-center.cursor-pointer.w-full
  .btn.bg-gray-300(v-if="state.octave.range.bottom != state.octave.limit.bottom" class="dark_bg-gray-900",@click="state.octave.dec(top)") 
    la-chevron-down
  .btn.bg-gray-50(v-if="state.octave.range.top != state.octave.limit.top" class="dark_bg-gray-500",@click="state.octave.inc(top)")
    la-chevron-up
</template>

<style lang="postcss" scoped>
.btn {
  @apply flex-1 font-bold p-2 opacity-70 m-2 shadow rounded-lg hover_opacity-100 transition;
}
</style>