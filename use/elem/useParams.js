import { reactive, watch, computed, shallowReactive } from "vue";
import { useElementary } from "./useElementary";
import { useClamp } from "@vueuse/math";
import { useStorage } from "@vueuse/core";
import { el } from "@elemaudio/core";

export function useParams(params, title = "ref") {
  const { audio } = useElementary()

  const controls = reactive({})
  const cv = shallowReactive({})
  const setters = shallowReactive({})
  const groups = shallowReactive({})

  for (let key in params) {
    const param = params[key]
    controls[key] = useClamp(
      param?.nostore ? param.value : useStorage(`${title}:${key}`, param.value),
      param.min,
      param.max
    )
    if (param?.hidden) continue
    const [group, name] = key.split(":")
    if (!group || !name) continue
    groups[group] = groups[group] || {}
    groups[group][name] = param;
  }

  watch(
    () => audio.initiated,
    initiated => {
      if (!initiated) return;
      for (let key in params) {
        let [node, setter] = audio.core.createRef("const", { value: controls[key] }, []);
        cv[key] = el.smooth(el.tau2pole(0.01), node);
        setters[key] = setter;
      }
    },
    { immediate: true }
  )

  watch(() => ({ ...controls }), (c1, c2) => {
    if (!audio.initiated) return
    for (let c in controls) {
      if (c1[c] != c2[c]) {
        setters[c]({ value: controls[c] });
      }
    }
  })

  return { controls, cv, setters, groups }
}
