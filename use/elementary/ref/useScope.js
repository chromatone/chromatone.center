import { computed, reactive } from "vue";

export const scopes = reactive({})

export function useScope(name = "synth") {

  return computed(() => scopes[name])
}