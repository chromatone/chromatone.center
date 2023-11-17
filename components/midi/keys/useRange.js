import { pitchColor } from '#/use/calculations';
import { noteColor } from '#/use/colors';
import { useMidi } from '#/use/midi';
import { notes } from '#/use/theory';
import { useStorage } from '@vueuse/core';
import { useGesture } from '@vueuse/gesture';
import { useClamp, useRound } from '@vueuse/math';
import { computed, ref } from 'vue';

export function useRange() {

  const begin = useClamp(useStorage('midi-keys-begin', 0), 0, 127)
  const end = useClamp(useStorage('midi-keys-end', 44), 0, 127)
  const roundBegin = useRound(begin)
  const roundEnd = useRound(end)
  const beginControl = ref()
  const endControl = ref()

  const keys = computed(() => {
    const arr = Array(roundEnd.value + 1 - roundBegin.value).fill(0).map((el, i) => i + roundBegin.value)
    return arr
  })

  useGesture({
    onDrag(ev) {
      ev.event.preventDefault()
      let val = begin.value + ev.delta[0] / 5
      if (val + 1 < end.value) begin.value = val
    },
    onWheel(ev) {
      ev.event.preventDefault()
      let val = begin.value - ev.velocities[0] / 5
      if (val + 1 < end.value) begin.value = val
    }
  }, {
    domTarget: beginControl,
    eventOptions: { passive: false }
  })

  useGesture({
    onDrag(ev) {
      ev.event.preventDefault()
      let val = end.value + ev.delta[0] / 5
      if (val > begin.value) end.value = val
    },
    onWheel(ev) {
      ev.event.preventDefault()
      let val = end.value - ev.velocities[0] / 5
      if (val > begin.value) end.value = val
    }
  }, {
    domTarget: endControl,
    eventOptions: { passive: false }
  })

  return { begin, end, roundBegin, roundEnd, beginControl, endControl, keys }
}