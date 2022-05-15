import { useRafFn } from "@vueuse/core"
import { Meter, UserMedia, gainToDb } from "tone"
import { useAudio } from "@use/audio"


export const mic = reactive({
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

    meter = new Meter()
    meter.normalRange = true
    input = new UserMedia().connect(meter)

    const { master } = useAudio()

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
        input.connect(master.limiter)
      } else {
        input.disconnect(master.limiter)
      }
    })

    watch(() => mic.volume, vol => {
      input.volume.rampTo(gainToDb(vol))
    })

  }
  return { mic, input }
}