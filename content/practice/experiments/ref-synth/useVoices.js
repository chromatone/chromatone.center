import { reactive, ref } from 'vue'

export function useVoices(count = 12) {

  const voices = reactive(Array(count).fill(true).map((_, i) => ({ key: `v${i}`, gate: 0.0, midi: 69, vel: 0 })))

  const next = ref(0)
  const overflow = ref(0)

  function cycleNote(num = 60, velocity = 0) {
    if (velocity) {
      do {
        next.value++
        if (next.value >= voices.length) {
          next.value = 0
          overflow.value++
        }
        if (overflow.value > 3) break;
      } while (voices[next.value].gate == 1)
      overflow.value = 0
      voices[next.value]['gate'] = 1;
      voices[next.value]['midi'] = num;
      voices[next.value]['vel'] = velocity / 127;
    } else {
      voices.forEach(v => {
        if (v.midi == num) {
          v.gate = 0
        }
      })
    }
  }

  function stopAll(num) {
    voices.forEach(v => v.gate = 0)
  }

  return { voices, cycleNote, stopAll }
}
