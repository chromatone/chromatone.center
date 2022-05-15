import { useRafFn } from "@vueuse/core"
import { Meter, UserMedia, gainToDb, Gain } from "tone"
import { useRecorder } from "./recorder"
import { master } from "@use/audio"


const mic = reactive({
  initiated: false,
  open: false,
  opened: false,
  monitor: false,
  meter: 0,
  volume: 1
})

let meter, input

export function useMic() {
  if (!mic.initiated) {
    const { recorder } = useRecorder()
    meter = new Meter()
    meter.normalRange = true
    input = new UserMedia().connect(meter)
    input.connect(recorder)
  }

  watch(() => mic.open, o => {
    if (o) {
      input.open().then(() => {
        mic.opened = true
        useRafFn(() => {
          mic.meter = meter.getValue()
        })
      })
    } else {
      input.close()
      mic.opened = false
    }
  })

  watch(() => mic.monitor, mon => {
    if (mon) {
      input.connect(master)
    } else {
      input.disconnect(master)
    }
  })

  watch(() => mic.volume, vol => {
    input.volume.rampTo(gainToDb(vol))
  })


  return { mic, input }
}