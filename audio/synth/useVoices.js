import { reactive } from 'vue'






[]

export function useVoices() {

  const voices = reactive({
    list: Array(8).fill(true).map((_, i) => ({ key: `v${i}`, gate: 0.0, midi: 69, vel: 0 })),
    next: 0,
    overflow: 0,
  })

  function cycleNote(num = 60, velocity = 0) {
    if (velocity) {
      do {
        voices.next++
        if (voices.next >= voices.list.length) {
          voices.next = 0
          voices.overflow++
        }
        if (voices.overflow > 3) break;
      } while (voices.list[voices.next].gate == 1)
      voices.overflow = 0
      voices.list[voices.next]['gate'] = 1;
      voices.list[voices.next]['midi'] = num;
      voices.list[voices.next]['vel'] = velocity / 127;
    } else {
      voices.list.forEach(v => {
        if (v.midi == num) {
          v.gate = 0
        }
      })
    }
  }

  function stopAll(num) {
    voices.list.forEach(v => v.gate = 0)
  }

  return { voices, cycleNote, stopAll }
}
