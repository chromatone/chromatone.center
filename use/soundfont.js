import { useAudio } from "#/use/audio";
import { midi } from "#/use/midi";
import { useStorage } from "@vueuse/core";
import { useClamp } from "@vueuse/math";
import { Soundfont, getSoundfontNames, Reverb, } from "smplr";
import { ref, watch, computed, reactive } from "vue";


const instrument = useStorage('sound-font', 'marimba')

const cached = reactive([])
const loaded = ref(false)
const active = ref(false)
const volume = useClamp(useStorage('sound-font-volume', 1), 0, 1)
const fontEnabled = useStorage('sound-font-enabled', true)

export function useSoundFont() {

  const { master } = useAudio()

  watch(instrument, instr => {
    cached[instr] = true
  })

  const ctx = master.context

  const reverb = new Reverb(ctx);

  const inst = computed(() => {
    loaded.value = false
    const ins = new Soundfont(ctx, {
      instrument: instrument.value,
    })
    ins.output.addEffect("reverb", reverb, 0.9);
    ins.load.then(() => {
      loaded.value = true
    });
    return ins
  })

  watch(volume, v => inst.value.output.setVolume(v * 127), {
    immediate: true
  })

  watch(() => midi.note, note => {
    if (!loaded.value || !fontEnabled.value) return
    if (note.type == "noteon") {
      inst.value.start({ note: note.number, velocity: note.velocity });
      active.value = true
    } else {
      inst.value.stop(note.number)
      active.value = false
    }
  })

  return {
    active,
    inst,
    getSoundfontNames,
    cached,
    loaded,
    instrument,
    fontEnabled,
    volume
  }
}