<script setup>
import { reactive, computed } from 'vue';
import { useElemAudio }
  from './useElemAudio';
import { el } from '@elemaudio/core';

function useTime() {

  const { meters, layers, silence } = useElemAudio()

  const time = reactive({
    clock: computed(() => meters?.['main:time']?.max),
  })

  const clock = el.mul(
    silence,
    el.meter({ name: 'main:time', key: 'main:time' }, el.time()))

  layers.time = { mute: true, signal: [silence, clock] }


  return { time }
}

const { time } = useTime()


</script>

<template lang='pug'>
.is-group.flex.flex-wrap 
  .p-2 {{ time.clock }}
</template>