import { useStorage } from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import { reactive, watch } from "vue"

import { NodeRepr_t, el } from '@elemaudio/core';

export interface Param {
  name?: string
  value?: number
  min?: number
  max?: number
  step?: number
  smooth?: number
  fixed?: number
  nostore?: boolean
  hidden?: boolean
}

export function useUI(params: { [key: string]: Param }, title = 'es') {

  const cs = {}
  const gs = {}
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

  const controls: { [key: string]: number } = reactive(cs)
  const groups: { [key: string]: { [key: string]: Param } } = reactive(gs)

  const cv: { [key: string]: NodeRepr_t } = reactive({})

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