import { computed, reactive, watch, onBeforeUnmount } from 'vue'
import { gainToDb, PanVol, MonoSynth } from 'tone'
import { pitchFreq } from 'chromatone-theory'

export function useSynth(pitch, octave) {
  const panVol = new PanVol(0, -Infinity).toDestination()
  const synth = new MonoSynth({
    oscillator: {
      type: 'sawtooth',
    },
    envelope: {
      attack: 0.05,
    },
  }).connect(panVol)

  const voice = reactive({
    vol: 0,
    pan: 50,
    started: false,
    active: computed(() => {
      return voice.vol > 0
    }),
    freq: computed(() => {
      let freq = pitchFreq(pitch, octave)
      synth.oscillator.frequency.value = freq
      return freq
    }),
  })

  onBeforeUnmount(() => {
    synth.triggerRelease()
  })

  watch(
    () => voice.vol,
    (vol) => {
      panVol.volume.targetRampTo(gainToDb((vol * 0.4) / 100))
    },
  )

  watch(
    () => voice.pan,
    (pan) => {
      let place = ((pan - 50) / 100) * 2
      panVol.pan.targetRampTo(place)
    },
  )

  watch(
    () => voice.active,
    (act) => {
      if (act) {
        synth.triggerAttack(voice.freq)
      } else {
        synth.triggerRelease()
      }
    },
  )

  return voice
}
