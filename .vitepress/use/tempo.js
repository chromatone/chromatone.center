import { reactive, computed, watch, onMounted } from "vue";
import { Transport, start, Frequency, Loop, Sampler } from "tone";
import { pitchColor, freqPitch } from "@use/calculations";
import { Note } from "@tonaljs/tonal";
import { useStorage } from "@vueuse/core";
import { useRafFn } from "@vueuse/core";
import { createChannel } from '@use/audio'

export const tempo = reactive({
  bpm: useClamp(useStorage("tempo-bpm", 100), 10, 500),
  blink: false,
  started: false,
  playing: false,
  stopped: false,
  mute: true,
  progress: 0,
  position: 0,
  ticks: 0,
  metre: {
    over: 4,
    under: 4,
    num: computed(() =>
      (tempo.metre.over / (tempo.metre.under / 4)).toFixed(2)
    ),
  },
  hz: computed(() => (tempo.bpm / 60).toFixed(2)),
  note: computed(() => Note.pitchClass(Frequency(tempo.hz).toNote())),
  tune: computed(() => {
    return Note.pitchClass(tempo.note) + 4;
  }),
  pitch: computed(() => freqPitch(tempo.hz)),
  digit: computed(() => (Frequency(tempo.hz).toMidi() + 12 * 10 + 3) % 12),
  color: computed(() => pitchColor(tempo.digit)),
  tap: {
    last: 0,
    diff: 0,
    timeout: 2000,
    times: [],
    bpm: null,
  },
  set(diff) {
    tempo.bpm = Math.round(diff + tempo.bpm)
  }
});



export function useTempo() {

  onMounted(() => {

    const { channel } = createChannel('tempo-tick')
    const pluck = new Sampler({
      urls: {
        E1: "/logic/high.wav",
        E2: "/logic/low.wav",
      },
      volume: -20,
      envelope: {
        attack: 0.001,
        release: 2,
      },
      baseUrl: "/audio/metronome/",
    }).connect(channel)

    const loop = new Loop((time) => {
      tempo.blink = true;
      if (!tempo.mute) {
        pluck.triggerAttackRelease('E1', '16n', time)
      }
      setTimeout(() => {
        tempo.blink = false;
      }, 60);
    }, "4n").start(0);

    useRafFn(() => {
      tempo.position = Transport.position;
      tempo.ticks = Transport.ticks;
      tempo.progress = loop.progress
    })

  });

  watch(
    () => tempo.bpm,
    (bpm) => Transport.bpm.rampTo(bpm, "4n"),
    { immediate: true }
  );

  watch(
    () => tempo.stopped,
    (stop) => {
      if (stop) {
        Transport.stop();
        tempo.playing = false;
      }
    }
  );

  watch(
    () => tempo.playing,
    (playing) => {
      if (playing) {
        if (!tempo.started) {
          start();
          tempo.started = true;
        }
        tempo.stopped = false;
        Transport.start();

      } else {
        Transport.pause();
      }
    }, {
    immediate: true
  }
  );
  return tempo;
}


export function tap() {
  var time = performance.now();
  if (tempo.tap.last) {
    tempo.tap.diff = time - tempo.tap.last;
    tempo.tap.times.push(tempo.tap.diff);
    refresh();
  }
  tempo.tap.last = time;
  beginTimeout();
}

function refresh() {
  if (tempo.tap.times.length > 2) {
    var average =
      tempo.tap.times.reduce((result, t) => (result += t)) /
      tempo.tap.times.length;
    var bpm = (1 / (average / 1000)) * 60;
    tempo.tap.bpm = bpm;
  }
}

let timer = null;
function beginTimeout() {
  clearTimeout(timer);
  timer = setTimeout(function () {
    tempo.tap.times = [tempo.tap.diff];
    tempo.tap.last = null;
  }, tempo.tap.timeout);
}