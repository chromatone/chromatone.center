import { reactive, watch, ref } from "vue";
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

  const next = ref(0)
  const overflow = ref(0)

  function cycleNote(num = 60, velocity = 0) {
    if (velocity) {
      do {
        next.value++
        if (next.value >= voiceRefs.length) {
          next.value = 0
          overflow.value++
        }
        if (overflow.value > 3) break;
      } while (voiceRefs[next.value].gate.value == 1)
      overflow.value = 0

      updateVoice(next.value, { gate: velocity > 0 ? 1 : 0, midi: num, vel: velocity });
    } else {
      voiceRefs.forEach((v, i) => {
        if (v.midi.value == num) {
          updateVoice(i, { gate: 0 });
        }
      })
    }
  }

  function stopAll() {
    voiceRefs.forEach((_, i) => updateVoice(i, { gate: 0 }))
  }

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
    getVoiceParam,
    cycleNote, stopAll
  };
}