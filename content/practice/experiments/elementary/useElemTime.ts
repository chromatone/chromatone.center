import { reactive, computed } from 'vue';
import { useElemAudio }
  from './useElemAudio';
import { el } from '@elemaudio/core';

export function useTime() {

  const { meters, layers, silence } = useElemAudio()

  const time = reactive({
    clock: computed(() => meters?.['main:time']?.[0]),
  })

  const clock = el.mul(
    silence,
    el.meter({ name: 'main:time', key: 'main:time' }, el.time()))

  layers.time = { mute: true, signal: [silence, clock] }

  return { time }
}