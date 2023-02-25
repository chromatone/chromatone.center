/**
 * @module Microphone
 */

import { reactive, watch } from 'vue'
import { useRafFn, useStorage } from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import { Meter, UserMedia, gainToDb, Gate, Compressor } from "tone"
import { createChannel } from "./audio"


export const mic = reactive({
  initiated: false,
  open: false,
  opened: false,
  recording: true,
  monitor: false,
  meter: 0,
  volume: useClamp(useStorage('mic-vol', 1), 0, 2),
  gate: useClamp(useStorage('mic-gate', -60), -100, -40)
})

let meter: Meter, input: UserMedia, gate: Gate, compressor: Compressor

export function useMic() {
  if (!mic.initiated) {

    meter = new Meter()
    meter.normalRange = true
    input = new UserMedia()
    compressor = new Compressor({ threshold: -20, ratio: 2 }).connect(meter)
    gate = new Gate({ threshold: -60, smoothing: 1 })

    input.connect(gate)
    gate.connect(compressor)

    const { channel } = createChannel('mic')

    watch(() => mic.open, o => {
      if (o) {
        input.open().then(() => {
          mic.opened = true
          useRafFn(() => {
            //@ts-expect-error
            mic.meter = meter.getValue()
          })
        })
      } else {
        input.close()
        mic.opened = false
      }
    })

    watch(() => mic.monitor, mon => mon ? meter.connect(channel) : meter.disconnect(channel))

    watch(() => mic.volume, vol => input.volume.rampTo(gainToDb(vol)), { immediate: true })

    watch(() => mic.gate, g => gate.threshold = g, { immediate: true })

  }
  return { mic, input }
}