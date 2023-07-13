<script setup>
import { reactive, computed } from 'vue';
import { useElemAudio } from './useElemAudio';

const { audio, render, meters } = useElemAudio()

const time = reactive({
  clock: computed(() => meters?.['main:time']?.max)
})
</script>

<template lang='pug'>
.is-group.flex.flex-wrap 
  .p-2 {{ time.clock }}
</template>