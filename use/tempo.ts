/**
 * @module Tempo
 */

import { reactive, computed, watch, onMounted, shallowReactive, Ref } from "vue";
import { Transport, start, Frequency, Loop, Sampler, gainToDb, Draw, Time, Limiter } from "tone";
import { freqPitch } from "./calculations";
import { noteColor } from './colors'
import { Note } from "tonal";
import { useStorage, onKeyStroke, useRafFn, RemovableRef, MaybeRef } from "@vueuse/core";
import { createChannel } from './audio'
import { useClamp } from "@vueuse/math";
import { WebMidi } from "webmidi";
import { midi } from "./midi";
import { useBroadcastChannel } from '@vueuse/core'
import { send } from "vite";


export const tempo: {
  initialized: boolean
  bpm: MaybeRef<number>
  hz: MaybeRef<string>
  note: MaybeRef<string>
  digit: MaybeRef<number>
  color: MaybeRef<string>
  pitch: MaybeRef<number>
  clock?: number
  midiClock: MaybeRef<boolean>
  tabSync: MaybeRef<boolean>
  blink: boolean
  started: boolean
  playing: boolean
  stopped: boolean | number
  mute: MaybeRef<boolean>
  volume: MaybeRef<number>
  progress: number
  position: string
  ticks: number
  set: (diff: number) => void
  metre: {
    over: number
    under: number
    num: MaybeRef<string>
  }
  tap: {
    last: number
    diff: number
    times: number[]
    timeout: number
    bpm: number
    tap: Function
  }
} = reactive({
  initialized: false,
  bpm: useClamp(useStorage("tempo-bpm", 100), 10, 500),
  clock: null,
  midiClock: useStorage("midi-clock-out", false),
  tabSync: useStorage("tab-sync", false),
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
  //@ts-ignore
  note: computed(() => Note.pitchClass(Frequency(tempo.hz).toNote())),
  tune: computed(() => {
    //@ts-ignore
    return Note.pitchClass(tempo.note) + 4;
  }),
  pitch: computed(() => freqPitch(Number(tempo.hz))),
  //@ts-ignore
  digit: computed(() => (Frequency(tempo.hz).toMidi() + 12 * 10 + 3) % 12),
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

  const metro: {
    counter: number
    pluck: Sampler
    channel: Limiter
    clock: Loop
    loop: Loop
  } = shallowReactive({
    counter: 0,
    pluck: null,
    channel: null,
    clock: null,
    loop: null
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

    }, "8n").start(0)

    useRafFn(() => {
      //@ts-expect-error
      tempo.position = Transport.position
      tempo.ticks = Transport.ticks
      tempo.progress = metro.loop.progress
    })

    onKeyStroke(" ", (ev) => {
      const elem = ev.target as HTMLElement
      if (["TEXTAREA", "INPUT"].includes(elem.nodeName)) return
      ev.preventDefault()
      tempo.playing = !tempo.playing
    });

    onKeyStroke("Enter", (ev) => {
      const elem = ev.target as HTMLElement
      if (["TEXTAREA", "INPUT"].includes(elem.nodeName)) return
      ev.preventDefault()
      tempo.stopped = Date.now()
    });



  });


  const broadCast = reactive({
    playing: false,
    stopped: false
  })

  const { data, post, } = useBroadcastChannel({ name: 'chromatone-tempo' })

  watch(data, (d: typeof broadCast) => {
    if (!tempo.tabSync) return
    tempo.playing = !!d?.playing
    tempo.stopped = !!d?.stopped
  })

  watch(() => tempo.volume, (volume: number) => metro.pluck.volume.rampTo(gainToDb(volume)))

  watch(
    () => tempo.bpm,
    (bpm: number) => Transport.bpm.rampTo(bpm, "4n"),
    { immediate: true }
  );

  watch(
    () => tempo.stopped,
    (stop) => {
      if (stop) {
        Transport.stop();
        midi.stopAll()
        tempo.playing = false;
        if (tempo.tabSync) {
          post({ stopped: stop })
        }
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

        if (tempo.tabSync) {
          post({ playing: true })
        }
      } else {
        midi.playing = false
        Transport.pause();
        if (tempo.tabSync) {
          post({ playing: false })
        }
      }
    }, {
    immediate: true
  }
  );

  watch(() => midi.playing, p => tempo.playing = p)
  watch(() => midi.stopped, s => tempo.stopped = s)

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