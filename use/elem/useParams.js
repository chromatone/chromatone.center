import { reactive, watch, computed } from "vue";
import { useElementary } from "./useElementary";
import { useClamp } from "@vueuse/math";
import { useStorage } from "@vueuse/core";
import { el } from "@elemaudio/core";

export function useParams(params, title = "ref") {
  const { audio } = useElementary()

  const controls = reactive({})
  const cv = reactive({})
  const setters = reactive({})
  const groups = reactive({})

  Object.keys(params).forEach(function (key) {
    const param = params[key];
    controls[key] = useClamp(
      param?.nostore ? param.value : useStorage(`${title}:${key}`, param.value),
      param.min,
      param.max
    );

    if (!param?.hidden) {
      const parts = key.split(":");
      const group = parts[0];
      const name = parts[1];
      if (group && name) {
        groups[group] = groups[group] || {}
        groups[group][name] = param;
      }
    }
  });

  watch(
    () => audio.initiated,
    function (initiated) {
      if (initiated) {
        if (!audio.initiated) return;
        Object.keys(params).forEach(function (key) {
          let [node, setter] = audio.core.createRef(
            "const",
            { value: controls[key] },
            []
          );
          cv[key] = el.smooth(el.tau2pole(0.01), node);
          setters[key] = setter;
        });
      }
    },
    { immediate: true }
  )

  watch(controls, () => Object.keys(controls).forEach((key) => {
    if (setters[key] && audio.initiated) {
      setters[key]({ value: controls[key] });
    }
  }),
    { deep: true }
  )

  return { controls, cv, setters, groups, }
}
