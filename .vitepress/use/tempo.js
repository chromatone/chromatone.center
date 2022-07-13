import { reactive, computed, watch, onMounted } from "vue";
import { Transport, start, Frequency, Loop, Sampler, gainToDb } from "tone";
import { pitchColor, freqPitch } from "#use/calculations";
import { Note } from "@tonaljs/tonal";
import { useStorage } from "@vueuse/core";
import { useRafFn } from "@vueuse/core";
import { createChannel } from '#use/audio'

export const tempo = reactive({
  initialized: false,
  bpm: useClamp(useStorage("tempo-bpm", 100), 10, 500),
  blink: false,
  started: false,
  playing: false,
  stopped: false,
  mute: useStorage("tempo-mute", true),
  volume: useClamp(useStorage("tempo-volume", 0.5), 0, 1),
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
  if (tempo.initialized) return tempo

  const metro = shallowReactive({
    counter: 0
  })

  onMounted(() => {

    const { channel } = createChannel('tempo-tick')
    metro.channel = channel
    metro.pluck = new Sampler({
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


    metro.loop = new Loop((time) => {
      let even = metro.counter % 2 == 0
      if (even)
        tempo.blink = true
      if (!tempo.mute) {
        metro.pluck.triggerAttackRelease(even ? 'E1' : 'E2', '16n', time, even ? 1 : 0.2)
      }
      metro.counter++
      setTimeout(() => {
        tempo.blink = false;
      }, 60);
    }, "8n").start(0);

    useRafFn(() => {
      tempo.position = Transport.position;
      tempo.ticks = Transport.ticks;
      tempo.progress = metro.loop.progress
    })

  });

  watch(() => tempo.volume, vol => metro.pluck.volume.rampTo(gainToDb(tempo.volume)))

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

  tempo.initialized = true
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