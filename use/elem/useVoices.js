import { reactive, watch, ref } from "vue";
import { useElementary } from "./useElementary";
import { el } from "@elemaudio/core";

export function useSynthVoices(VOICE_COUNT = 12) {
  const { audio } = useElementary();

  const voiceRefs = reactive(Array(VOICE_COUNT).fill(null).map(() => createVoice()));

  const nextVoiceIndex = ref(0);

  watch(() => audio.initiated, (initiated) => initializeRefs(initiated, audio, voiceRefs), { immediate: true });

  function cycleNote(num, velocity) {
    if (velocity > 0) {
      const index = findNextAvailableVoice(voiceRefs, nextVoiceIndex);
      updateVoice(voiceRefs, index, { gate: 1, midi: num, vel: velocity });
    } else {
      releaseVoices(voiceRefs, num);
    }
  }

  function stopAll() {
    voiceRefs.forEach((_, i) => updateVoice(voiceRefs, i, { gate: 0 }));
  }

  function getVoiceParam(index, param) {
    return el.meter({ name: `synth-voice-${index}-${param}` }, voiceRefs[index][param].ref || el.const({ value: voiceRefs[index][param].value }));
  }

  return { voiceRefs, updateVoice: (index, params) => updateVoice(voiceRefs, index, params), getVoiceParam, cycleNote, stopAll };
}

function createVoice() {
  return {
    gate: { value: 0, ref: null, setter: null },
    midi: { value: 0, ref: null, setter: null },
    vel: { value: 0, ref: null, setter: null }
  };
}

function initializeRefs(initiated, audio, voiceRefs) {
  if (!initiated) return;

  voiceRefs.forEach(voice => {
    ['gate', 'midi', 'vel'].forEach(param => {
      const [ref, setter] = audio.core.createRef('const', { value: voice[param].value }, []);
      voice[param].ref = ref;
      voice[param].setter = setter;
    });
  });
}

function findNextAvailableVoice(voiceRefs, nextVoiceIndex) {
  const startIndex = nextVoiceIndex.value;
  let index = startIndex;

  do {
    if (voiceRefs[index].gate.value === 0) {
      nextVoiceIndex.value = (index + 1) % voiceRefs.length;
      return index;
    }
    index = (index + 1) % voiceRefs.length;
  } while (index !== startIndex);

  nextVoiceIndex.value = (startIndex + 1) % voiceRefs.length;
  return startIndex;
}

function updateVoice(voiceRefs, index, params) {
  const voice = voiceRefs[index];
  Object.entries(params).forEach(([param, value]) => {
    if (param in voice && value !== undefined) {
      voice[param].value = value;
      voice[param].setter?.({ value });
    }
  });
}

function releaseVoices(voiceRefs, midiNote) {
  voiceRefs.forEach((v, i) => {
    if (v.midi.value === midiNote) {
      updateVoice(voiceRefs, i, { gate: 0 });
    }
  });
}