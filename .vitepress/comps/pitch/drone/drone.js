import { freqColor, freqPitch, pitchFreq } from 'chromatone-theory'
import { Frequency } from 'tone'

export const drone = reactive({
  base: 55,
  freq: useStorage('drone-freq', 110),
  stopped: true,
  volume: useStorage('drone-vol', 0.5),
  note: computed(() => Frequency(drone.freq).toNote()),
  pitch: computed({
    get() {
      return Math.round((freqPitch(drone.freq) + 72) % 12)
    },
    set(pitch) {
      drone.freq = pitchFreq(pitch - 36)
    },
  }),
  cents: computed(() => getCents(drone.freq) % 1200),
  centDiff: computed(() => drone.cents - drone.pitch * 100),
  color: computed(() => freqColor(drone.freq)),
})

function getStandardFrequency(pitch, base = drone.base) {
  return base * Math.pow(2, pitch / 12)
}

function getCents(freq, pitch = 0) {
  return Math.floor(
    (1200 * Math.log(freq / getStandardFrequency(pitch))) / Math.log(2),
  )
}
