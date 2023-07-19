import { useStorage } from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import { Ref } from "vue"
import { computed, reactive, unref } from "vue"
import { NodeRepr_t, el } from '@elemaudio/core';
import { shallowReactive } from "vue";
import { watch } from "vue";

export interface Param {
  name: string
  value?: number
  min?: number
  max?: number
  step?: number
}

export function useUI(params: Param[], title = 'es') {

  const cs = {}
  const gs = {}
  params.forEach(p => {
    cs[p.name] = useClamp(useStorage(`${title}:${p.name}`, p.value), p.min, p.max)

    const split = p.name.split(':')
    const name = split.pop()
    const group = split.pop()
    gs[group] = gs[group] || {}
    gs[group][name] = p
  })

  const controls: { [key: string]: number } = reactive(cs)

  const groups: { [key: string]: { [key: string]: Param } } = reactive(gs)

  const cv: { [key: string]: NodeRepr_t } = {}

  watch(controls, () => {

    for (let c in controls) {
      cv[c] = el.smooth(
        el.tau2pole(0.01),
        el.const({
          key: `${title}:${c}`,
          value: controls[c]
        }))

      // console.log(`${title}:${c}`, controls[c])
    }
  }, { immediate: true })


  return {
    controls,
    cv,
    groups,
    params
  }
}