import { reactive, watch } from "vue";
import { useElementary } from "./useElementary";
import { el } from "@elemaudio/core";

const VOICE_COUNT = 12; // Or however many voices you want

export function useSynthVoices() {
  const voiceRefs = reactive(
    Array(VOICE_COUNT).fill(null).map((_, i) => ({
      gate: { value: 0, ref: null, setter: null },
      midi: { value: 0, ref: null, setter: null },
      vel: { value: 0, ref: null, setter: null }
    }))
  );

  const { audio } = useElementary()

  // Initialize refs when audio is ready
  watch(() => audio.initiated, (initiated) => {
    if (!initiated) return;

    voiceRefs.forEach((voice, i) => {
      for (const param of ['gate', 'midi', 'vel']) {
        const [ref, setter] = audio.core.createRef(
          'const',
          { value: voice[param].value },
          []
        );
        voice[param].ref = ref;
        voice[param].setter = setter;
      }
    });
  }, { immediate: true });


  const updateVoice = (index, { gate, midi, vel }) => {
    const voice = voiceRefs[index];
    if (gate !== undefined) {
      voice.gate.value = gate;
      voice.gate.setter?.({ value: gate });
    }
    if (midi !== undefined) {
      voice.midi.value = midi;
      voice.midi.setter?.({ value: midi });
    }
    if (vel !== undefined) {
      voice.vel.value = vel;
      voice.vel.setter?.({ value: vel });
    }
  };

  // Helper function to get Elementary node for a voice parameter
  const getVoiceParam = (index, param) => voiceRefs[index][param].ref || el.const({ value: voiceRefs[index][param].value });

  return {
    voiceRefs,
    updateVoice,
    getVoiceParam
  };
}