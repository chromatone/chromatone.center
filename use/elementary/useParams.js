import { reactive, ref, watch } from 'vue';

import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';
import { useElementary } from './useElementary.js';

const { audio } = useElementary()

export function useParams(params, title = 'ref') {

  const controls = reactive({})
  const cv = {}
  const setters = {}
  const groups = {}


  for (let p in params) {
    let param = params[p]
    controls[p] = useClamp(param?.nostore ? param.value : useStorage(`${title}:${p}`, param.value), param.min, param.max)
    if (!param?.hidden) {
      const split = p.split(':')
      const name = split.pop()
      const group = split.pop()
      groups[group] = groups[group] || {}
      groups[group][name] = param
    }
  }

  watch(() => audio.initiated, () => {
    if (!audio.initiated) return
    for (let p in params) {
      let [node, setter] = audio.core.createRef("const", { value: controls[p] }, []);
      cv[p] = node
      setters[p] = setter
    }
  }, { immediate: true })

  watch(controls, cs => {
    for (let c in cs) {
      if (!setters[c]) continue
      setters[c]({ value: cs[c] })
    }
  })

  return { controls, cv, setters, groups }
}