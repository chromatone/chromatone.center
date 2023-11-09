import { useAudio } from '../useAudio.js';
import { reactive, ref, watch } from 'vue';

import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';

const { audio } = useAudio()

export function useParams(params, title = 'ref') {

  const controls = reactive({})
  const cv = {}
  const setters = {}

  for (let p in params) {
    let param = params[p]
    controls[p] = useClamp(param?.nostore ? param.value : useStorage(`${title}:${p}`, param.value), param.min, param.max)
  }

  watch(() => audio.initiated, (i) => {
    if (!i) return
    for (let p in params) {
      let [val, setter] = audio.core.createRef("const", { value: controls[p] }, []);
      cv[p] = val
      setters[p] = setter
    }
  })

  watch(controls, cs => {
    for (let c in cs) {
      if (!setters[c]) continue
      setters[c]({ value: cs[c] })
    }
  })

  return { controls, cv, setters }
}