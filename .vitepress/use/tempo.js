import { reactive, computed, watch, onMounted } from 'vue'
import { Transport, PluckSynth, start, Frequency, Loop } from 'tone'
import { pitchColor } from 'chromatone-theory'
import { Note } from '@tonaljs/tonal'
import { useStorage } from '@vueuse/core'

export const tempo = reactive({
  bpm: useStorage('tempo-bpm', 100),
  blink: false,
  started: false,
  playing: false,
  stopped: false,
  progress: 0,
  position: 0,
  ticks: 0,
  metre: {
    over: 4,
    under: 4,
    num: computed(() =>
      (tempo.metre.over / (tempo.metre.under / 4)).toFixed(2),
    ),
  },
  hz: computed(() => (tempo.bpm / 60).toFixed(2)),
  note: computed(() => Frequency(tempo.hz).toNote()),
  tune: computed(() => {
    return Note.pitchClass(tempo.note) + 4
  }),
  digit: computed(() => (Frequency(tempo.hz).toMidi() + 12 * 10 + 3) % 12),
  color: computed(() => pitchColor(tempo.digit)),
})

export function useTempo() {
  onMounted(() => {
    const loop = new Loop((time) => {
      tempo.blink = true
      setTimeout(() => {
        tempo.blink = false
      }, 60)
    }, '4n').start(0)
  })
  return tempo
}

watch(
  () => tempo.bpm,
  (bpm) => Transport.bpm.rampTo(bpm, '4n'),
)

watch(
  () => tempo.stopped,
  (stop) => {
    if (stop) {
      Transport.stop()
      tempo.playing = false
    }
  },
)

watch(
  () => tempo.playing,
  (playing) => {
    if (playing) {
      if (!tempo.started) {
        start()
        tempo.started = true
      }
      tempo.stopped = false
      Transport.start()
      requestAnimationFrame(function progress() {
        tempo.position = Transport.position
        tempo.ticks = Transport.ticks
        if (tempo.playing) {
          requestAnimationFrame(progress)
        }
      })
    } else {
      Transport.pause()
    }
  },
)
