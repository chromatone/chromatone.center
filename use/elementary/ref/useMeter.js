import { computed, reactive } from "vue"

export const meters = reactive({})

export function useMeter(name = 'synth') {
  return computed(() => meters[name])
}
