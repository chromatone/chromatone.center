import { useStorage } from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import { reactive, watch } from "vue"

import { el } from '@elemaudio/core';

export function useUI(params, title = 'es') {

  const cs = {} // controls
  const gs = {} // groups of controls
  for (let p in params) {
    const param = params[p]
    cs[p] = useClamp(param?.nostore ? param.value : useStorage(`${title}:${p}`, param.value), param.min, param.max)
    if (!param?.hidden) {
      const split = p.split(':')
      const name = split.pop()
      const group = split.pop()
      gs[group] = gs[group] || {}
      gs[group][name] = param
    }
  }

  const controls = reactive(cs)
  const groups = reactive(gs)

  const cv = reactive({})

  watch(controls, () => {
    for (let c in controls) {
      cv[c] = el.smooth(
        el.tau2pole(params[c]?.smooth || 0.01),
        el.const({
          key: `${title}:${c}`,
          value: controls[c]
        }))
    }
  }, { immediate: true })

  return {
    controls,
    cv,
    groups,
    params
  }
}