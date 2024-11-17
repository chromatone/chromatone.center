/**
 * @module Tempo
 */

import { reactive, computed, watch, onMounted, shallowReactive, ref, } from "vue";
import { getTransport, start, Frequency, Loop, Sampler, gainToDb, getDraw, } from "tone";
import { freqPitch } from "./calculations";
import { noteColor } from './colors'
import { Note } from "tonal";
import { useStorage, onKeyStroke, useRafFn, } from "@vueuse/core";
import { createAudioChannel } from './audio'
import { useClamp } from "@vueuse/math";
import { WebMidi } from "webmidi";
import { midi, stopAll } from "./midi";
import { useBroadcastChannel } from '@vueuse/core'

export const bpm = useClamp(useStorage("tempo-bpm", 100), 10, 500)

export const tempo = reactive({
  initialized: false,
  bpm,
  midiClock: useStorage("midi-clock", true),
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
  hz: computed(() => (tempo.bpm / 60).toFixed(2)),
  note: computed(() => Note.pitchClass(Frequency(tempo.hz).toNote())),
  tune: computed(() => Note.pitchClass(tempo.note) + 4),
  pitch: computed(() => freqPitch(Number(tempo.hz))),
  digit: computed(() => (Frequency(tempo.hz).toMidi() + 12 * 10 + 3) % 12),
  color: computed(() => noteColor(tempo.digit)),
  set(diff) {
    tempo.bpm = Math.round(diff + tempo.bpm)
  }
});

export function useTempo() {
  if (tempo.initialized) return tempo

  const Draw = getDraw()
  const transport = getTransport()

  const metro = shallowReactive({
    counter: 0,
    pluck: null,
    clock: null,
    loop: null
  })

  onMounted(() => {
    const { channel } = createAudioChannel('tempo-tick')
    metro.pluck = new Sampler({
      urls: {
        E1: clickSounds.low,
        E2: clickSounds.high,
      },
      volume: -20,
      attack: 0.001,
      release: 2,
    }).connect(channel)

    metro.clock = new Loop(t => {
      if (!tempo.midiClock) return
      Draw.schedule(() => {
        WebMidi.outputs.forEach(output => output.sendClock())
      }, t)
    }, '8i').start(0)

    metro.loop = new Loop((time) => {
      let even = metro.counter % 2 == 0
      if (!even) {
        Draw.schedule(() => {
          tempo.blink = true
        }, time)
      } else {
        Draw.schedule(() => {
          tempo.blink = false
        }, time)
      }

      if (!tempo.mute) {
        metro.pluck.triggerAttackRelease(even ? 'E1' : 'E2', '16n', time, even ? 1 : 0.2)
      }
      metro.counter++

    }, "8n").start(0)

    useRafFn(() => {
      tempo.position = transport.position
      tempo.ticks = transport.ticks
      tempo.progress = metro.loop.progress
    })

    onKeyStroke(" ", (ev) => {
      const elem = ev.target
      if (["TEXTAREA", "INPUT"].includes(elem.nodeName)) return
      ev.preventDefault()
      tempo.playing = !tempo.playing
    });

    onKeyStroke("Enter", (ev) => {
      const elem = ev.target
      if (["TEXTAREA", "INPUT"].includes(elem.nodeName)) return
      ev.preventDefault()
      tempo.stopped = Date.now()
    });

  });

  const { data, post } = useBroadcastChannel({ name: 'chromatone-tempo' })

  watch(data, (d) => {
    if (!tempo.tabSync) return
    tempo.playing = !!d?.playing
    tempo.stopped = !!d?.stopped
  })

  watch(() => tempo.volume, (volume) => metro?.pluck?.volume?.rampTo(gainToDb(volume)), { immediate: true })

  watch(bpm,
    (b) => transport.bpm.rampTo(b, "4n"),
    { immediate: true }
  );

  watch(
    () => tempo.stopped,
    (stop) => {
      if (stop) {

        transport.stop();
        stopAll()
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
        transport.start();
        midi.playing = true

        if (tempo.tabSync) {
          post({ playing: true })
        }
      } else {
        midi.playing = false
        transport.pause();
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


// TAP TEMPO

export const tapTempo = reactive({
  timer: null,
  last: 0,
  diff: 0,
  timeout: 2000,
  times: [],
  bpm: null,
  tap,
  refresh
})

function tap() {
  let time = performance.now();
  if (tapTempo.last) {
    tapTempo.diff = time - tapTempo.last;
    tapTempo.times.push(tapTempo.diff);
    refresh();
  }
  tapTempo.last = time;
  clearTimeout(tapTempo.timer);
  tapTempo.timer = setTimeout(function () {
    tapTempo.times = [tapTempo.diff];
    tapTempo.last = null;
  }, tapTempo.timeout);
}

function refresh() {
  if (tapTempo.times.length > 2) {
    let average =
      tapTempo.times.reduce((result, t) => (result += t)) /
      tapTempo.times.length;
    let bpm = (1 / (average / 1000)) * 60;
    tapTempo.bpm = bpm;
  }
}

export const clickSounds = {
  low: "data:@file/wav;base64,UklGRqoEAABXQVZFZm10IBAAAAABAAEARKwAAMwEAgADABgAZGF0YYYEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADr1BAakh+PpCsipjQ1XzoAxjyZ+zsgRzhiDzJd0ykpIiCrkhWHuwqoKwDEY/YG0e0eyea/h+GhLd7fwNysLt0cTt/T4+JZpufJQu2kYfN9q/lQzf9KfAXheAojkQ4qohG7mBMKcRTENRR0/hJh7RALLQ537QpjYQeJuwMhLACt3vwm+Pmrlfeey/VPpfQYJfTpRPQ39/Q3KPZTv/e6oPkBr/u2zP3Y3f8cyQH+eAOE3ATE5wUZlAYR4AYazwYAaQYvuQXhzQQztwM0hgL5SwHIGABT+/4iAP4XMf0rlfxEMPxHA/xADPy1RvwMrPwMNP1e1f0fhv5lPP+87v+alACzJgFEnwE8+gFONQLwTwI9SwLHKQJe7wHEoAFiQwHz3AA5cwCwCwBQq/9YVv8iEP8Q2/58uP65qP4oq/5Ovv743/5lDf9zQ//Qfv8jvP8++P8+MACpYQCLigCAqQC+vQARxwDTxQDeugB4pwA3jQDtbQCHSwD0JwAQBQCH5P/Jx//7r//rnf8Skv+PjP8ujf9zk/+hnv/Mrf/pv//Y0/966P+7/P+jDwBaIAA3LgC/OACuPwDxQgCjQgANPwCcOADYLwBcJQDPGQDYDQAVAgAa9/9h7f9P5f8q3/8b2/8u2f9T2f9f2/8V3/8m5P836v/p8P/a9/+t/v8PBQC2CgBpDwD/EgBfFQCCFgByFgBGFQAiEwA1EACyDADRCADKBADUAAAf/f/V+f8Z9/8C9f+e8//y8v/58v+k8//f9P+Q9v+Z+P/Y+v8u/f97//+iAQCMAwAjBQBbBgAsBwCRBwCPBwAtBwB3BgB9BQBQBAADAwCoAQBSAAAS///1/f8I/f9S/P/Y+/+c+/+c+//U+/89/P/N/P98/f89/v8G///M//+GAAAsAQC2AQAgAgBoAgCLAgCLAgBrAgAvAgDcAQB3AQAHAQCSAAAfAACz//9T//8C///E/v+b/v+G/v+F/v+X/v+6/v/q/v8l//9m//+p///s//8rAABjAACSAAC2AADOAADbAADbAADRAAC9AAChAAB/AABZAAAyAAALAADn///G//+r//+W//+I//+B//+A//+G//+S//+i//+1///L///i///4//8NAAAgAAAwAAA9AABFAABJAABJAABGAAA/AAA2AAArAAAeAAARAAAEAAD4///t///j///c///X///V///V///X///a///g///m///u///1///9//8EAAAKAAAQAAAUAAAXAAAYAAAYAAAXAAAVAAASAAAOAAAKAAAGAAABAAD9///5///2///0///y///x///x///y///z///1///4///6///9//8AAAAAAAACAAAEAAAFAAAFAAAGAAAGAAAGAAAFAAAEAAACAAACAAABAAAAAAAAAAD////+///+///+///+///+///+///+//////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
  high: "data:@file/wav;base64,UklGRhgFAABXQVZFZm10IBAAAAABAAEARKwAAMwEAgADABgAZGF0YY8EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv+wgYUREH2hjDdR+0CiVYhilW3SxfCy/wEjDn/C8I2C5UuCxftimA7iUHgCFkjBxNNhfsoBEN7wtjQgbTugDYdfv8jfZkGvJ7Lu6z2epfJ+irHuaiwuRaEuQlCeTenuRDyOVgd+f6m+kPJOxN/O6VEPJzTPWam/hS6vvjJf/wPALKHwWwwAcJFAqIEAxArw216w7Mww/BNxAEShAP/w8yXQ9abA7ONQ3qwwvUIQo2Wwj0ewbljwSRogLzvgBE7/7JPP2qr/vUTvrhH/kGJ/gTZ/dv4fYllvb3g/ZxqPYJAPdBhvfMNfi2CPmR+Pmb/vrrE/yaMf3rUP5sa/8aewB7egG6ZAK1NQMO6gM2fwRv8wTLRQUpdgUphQUhdAULRQVy+gRdlwQ3HwS2lQPD/gJhXgKWuAFSEQFdbABAzf81N/8brf5oMf4gxv3RbP2QJv348/wq1fzayfxN0fxq6vzAE/2WS/31j/263v2iNf5Ykv6E8v7ZU/8itP9IEQBmaQDHugD1AwG5QwEkeQGLowGJwgEC1gEb3gE32wHyzQEetwG1lwHXcAHAQwHAEQEv3ABspADOawChMwAe/f9lyf93mf8ybv9RSP9mKP/ZDv/o+/6t7/4U6v7q6v7Y8f5o/v4LEP8dJv/mP/+nXP+Ve//nm//SvP+V3f94/f/RGwAJOACaUQAWaAAkewCFigAQlgC2nQB7oQB9oQDsnQAKlwAojQCkgADocQBiYQCITwDPPACtKQCUFgDvAwAi8v+I4f9u0v8Yxf+6uf98sP92qf+1pP82ov/qof+3o/94p///rP8WtP+AvP/9xf9J0P8g2/895v9e8f9E/P+0BgB4EABhGQBJIQAQKACcLQDfMQDRNAByNgDKNgDnNQDdMwDIMADGLAD5JwCHIgCXHABRFgDdDwBhCQADAwDm/P8o9//m8f837f8u6f/a5f9F4/904f9n4P8b4P+H4P+g4f9X4/+a5f9X6P926//i7v+D8v9C9v8I+v/A/f9VAQC1BADPBwCUCgD7DAD5DgCJEACnEQBTEgCOEgBeEgDHEQDUEACNDwD+DQA0DAA8CgAjCAD2BQDEAwCYAQB///+E/f+w+/8M+v+f+P9t9/989v/M9f9f9f809f9I9f+Y9f8f9v/X9v+59//A+P/i+f8Y+/9b/P+i/f/m/v8hAABLAQBeAgBXAwAwBADmBAB4BQDjBQAoBgBGBgA/BgAVBgDLBQBkBQDjBABNBACmAwDzAgA4AgB5AQC8AAAEAABW//+z/v8g/v+g/f8z/f/b/P+Z/P9u/P9a/P9b/P9x/P+Z/P/T/P8c/f9y/f/S/f86/v+m/v8V//+D///u//9VAAC0AAALAQBYAQCZAQDNAQD1AQAQAgAeAgAfAgAUAgDuAQDAAQCNAQBVAQAbAQDfAAClAABuAAA7AAAMAADk///A//+k//+O//9+//90//9v//9x//92//9+//+K//+X//+m//+1///E///S///f///q///z///6//////8BAAABAAAATElTVFwAAABJTkZPSUNSRAsAAAAyMDA1LTA2LTA3AABJRU5HFgAAAEdSQUJBQ0lPTkVTX01JVElDQVMgIABJU0ZUHgAAAFNvbmljIEZvdW5kcnkgU291bmQgRm9yZ2UgNS4wAA==",
}