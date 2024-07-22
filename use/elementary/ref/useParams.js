import { reactive, watch, computed } from "vue";
import { useElementary } from './useElementary';
import { useClamp } from "@vueuse/math";
import { useStorage } from "@vueuse/core";

function initParams(params, title, controls, groups) {
  Object.keys(params).forEach(function (key) {
    const param = params[key];
    controls[key] = useClamp(
      param?.nostore ? param.value : useStorage(`${title}:${key}`, param.value),
      param.min,
      param.max
    );

    if (!param?.hidden) {
      const parts = key.split(':');
      const group = parts[0];
      const name = parts[1];
      if (group && name) {
        groups[group] = groups[group] || {};
        groups[group][name] = param;
      }
    }
  });
}

function initAudioRefs(audio, params, controls, cv, setters) {
  if (!audio.initiated) return;
  Object.keys(params).forEach(function (key) {
    let [node, setter] = audio.core.createRef("const", { value: controls[key] }, []);
    cv[key] = node;
    setters[key] = setter;
  });
}

function updateParams(controls, setters, audio) {
  Object.keys(controls).forEach(function (key) {
    if (setters[key] && audio.initiated) {
      setters[key]({ value: controls[key] });
    }
  });
}

export function useParams(params, title = 'ref') {
  const { audio } = useElementary();

  const controls = reactive({});
  const cv = reactive({});
  const setters = reactive({});
  const groups = reactive({});

  initParams(params, title, controls, groups);

  watch(function () { return audio.initiated; }, function (initiated) {
    if (initiated) {
      initAudioRefs(audio, params, controls, cv, setters);
    }
  }, { immediate: true });

  watch(controls, function () {
    updateParams(controls, setters, audio);
  }, { deep: true });


  return {
    controls,
    cv,
    setters,
    groups,

  };
}