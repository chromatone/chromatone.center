import { reactive, computed, watch, onMounted, shallowReactive, Ref } from "vue";
import { Transport, start, Frequency, Loop, Sampler, gainToDb, Draw, Time } from "tone";
import { freqPitch } from "#/use/calculations";
import { noteColor } from '#/use/colors'
import { Note } from "@tonaljs/tonal";
import { useStorage, onKeyStroke, useRafFn, RemovableRef, MaybeComputedRef } from "@vueuse/core";
import { createChannel } from '#/use/audio'
import { useClamp } from "@vueuse/math";
import { WebMidi } from "webmidi";
import { midi } from "./midi";

export interface Tempo {
  initialized: boolean
  bpm: number
  hz: MaybeComputedRef<string>
  note: MaybeComputedRef<string>
  digit: MaybeComputedRef<number>
  color: MaybeComputedRef<string>
  clock?: number
  midiClock: MaybeComputedRef<boolean>
  blink: boolean
  started: boolean
  playing: boolean
  stopped: boolean | number
  mute: MaybeComputedRef<boolean>
  volume: MaybeComputedRef<number>
  progress: number
  position: string
  ticks: number
  set: (diff: number) => void
  metre: {
    over: number
    under: number
    num: MaybeComputedRef<string>
  }
  tap: {
    last: number
    diff: number
    times: number[]
    timeout: number
    bpm: number
    tap: Function
  }
}

export const tempo: Tempo = reactive({
  initialized: false,
  bpm: useClamp(useStorage("tempo-bpm", 100), 10, 500) as unknown as number,
  clock: null,
  midiClock: useStorage("midi-clock-out", false),
  blink: false,
  started: false,
  playing: false,
  stopped: false,
  mute: useStorage("tempo-mute", true),
  volume: useClamp(useStorage("tempo-volume", 0.5), 0, 1),
  progress: 0,
  position: null,
  ticks: 0,
  metre: {
    over: 4,
    under: 4,
    num: computed(() =>
      (tempo.metre.over / (tempo.metre.under / 4)).toFixed(2)
    ),
  },
  hz: computed(() => (tempo.bpm as number / 60).toFixed(2)),
  note: computed(() => Note.pitchClass(Frequency(tempo.hz as string).toNote())),
  tune: computed(() => {
    return Note.pitchClass(tempo.note as string) + 4;
  }),
  pitch: computed(() => freqPitch(Number(tempo.hz))),
  digit: computed(() => (Frequency(tempo.hz as string).toMidi() + 12 * 10 + 3) % 12),
  color: computed(() => noteColor(tempo.digit as number)),
  tap: {
    last: 0,
    diff: 0,
    timeout: 2000,
    times: [],
    bpm: null,
    tap
  },
  set(diff: number) {
    tempo.bpm = Math.round(diff + (tempo.bpm as number))
  }
});

export function useTempo() {
  if (tempo.initialized) return tempo

  const metro = shallowReactive({
    counter: 0,
    pluck: null,
    channel: null,
    clock: null,
    loop: null
  })

  onMounted(() => {

    const channel = createChannel('tempo-tick')
    metro.channel = channel
    metro.pluck = new Sampler({
      urls: {
        E1: "/logic/high.wav",
        E2: "/logic/low.wav",
      },
      volume: -20,
      attack: 0.001,
      release: 2,
      baseUrl: "/audio/metronome/",
    }).connect(channel)

    metro.clock = new Loop(t => {
      if (!tempo.midiClock) return
      Draw.schedule(() => {
        WebMidi.outputs.forEach(output => output.sendClock())
      }, t)
    }, '8i').start(0)

    metro.loop = new Loop((time) => {
      let even = metro.counter % 2 == 0
      if (even) {
        Draw.schedule(() => {
          tempo.blink = true
          setTimeout(() => {
            tempo.blink = false;
          }, 60);
        }, time)
      }

      if (!tempo.mute) {
        metro.pluck.triggerAttackRelease(even ? 'E1' : 'E2', '16n', time, even ? 1 : 0.2)
      }
      metro.counter++

    }, "8n").start(0);

    useRafFn(() => {
      tempo.position = Transport.position as string;
      tempo.ticks = Transport.ticks;
      tempo.progress = metro.loop.progress
    })

    onKeyStroke(" ", (ev) => {
      const elem = ev.target as HTMLElement
      if (["TEXTAREA", "INPUT"].includes(elem.nodeName)) return;
      ev.preventDefault()
      tempo.playing = !tempo.playing;
    });

    onKeyStroke("Enter", (ev) => {
      const elem = ev.target as HTMLElement
      if (["TEXTAREA", "INPUT"].includes(elem.nodeName)) return;
      ev.preventDefault();
      tempo.stopped = Date.now();
    });

  });

  watch(() => tempo.volume, (volume) => metro.pluck.volume.rampTo(gainToDb(volume as number)))

  watch(
    () => tempo.bpm,
    (bpm) => Transport.bpm.rampTo(bpm as number, "4n"),
    { immediate: true }
  );

  watch(
    () => tempo.stopped,
    (stop) => {
      if (stop) {
        Transport.stop();
        midi.stopAll()
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
        midi.playing = true
      } else {
        midi.playing = false
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