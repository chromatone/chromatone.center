import { reactive, computed, watch } from 'vue'
import { Transport, start, Frequency, Loop } from 'tone'
import { pitchColor } from 'chromatone-theory'

export const tempo = reactive({
  bpm: 100,
  blink: false,
  started: false,
  playing: false,
  stopped: false,
  progress: 0,
  position: 0,
  metre: {
    over: 4,
    under: 4,
    num: computed(() =>
      (tempo.metre.over / (tempo.metre.under / 4)).toFixed(2),
    ),
  },
  hz: computed(() => (tempo.bpm / 60).toFixed(2)),
  note: computed(() => Frequency(tempo.hz).toNote()),
  digit: computed(() => (Frequency(tempo.hz).toMidi() + 12 * 10 + 3) % 12),
  color: computed(() => pitchColor(tempo.digit)),
})

const loop = new Loop((time) => {
  tempo.blink = true
  setTimeout(() => {
    tempo.blink = false
  }, 60)
}, '4n').start(0)

watch(
  () => tempo.bpm,
  (bpm) => Transport.bpm.rampTo(bpm, 1),
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
        tempo.progress = loop.progress
        tempo.position = Transport.position
        if (tempo.playing) {
          requestAnimationFrame(progress)
        }
      })
    } else {
      Transport.pause()
    }
  },
)
