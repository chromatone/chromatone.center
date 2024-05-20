/**
 * @module MIDI
 */
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { reactive, computed, watchEffect, onMounted, ref, watch, shallowReactive } from 'vue';
import { WebMidi, Note, } from "webmidi";
import { setupKeyboard } from './keyboard';
import Ola from "ola";
import { Chord, Midi } from 'tonal';
import { Frequency } from 'tone';

export const midi = reactive({
  enabled: false,
  initiated: false,
  playing: false,
  stopped: false,
  out: true,
  inputs: {},
  outputs: {},
  forwards: {},
  channels: {},
  channel: useStorage("global-midi-channel", 1),
  note: {
    pitch: 0,
    channel: 1,
    velocity: 0,
  },
  offset: useClamp(0, -3, 3),
  keyboard: true,
  cc: {},
  ccLearn: {},
  message: null,
  log: [],
  clock: 0,
  filter: useStorage("global-midi-filter", {}),
  available: computed(() => Object.entries(midi.outputs).length > 0),
  activeNotes: computed(() => {
    let notes = {};
    for (let ch in midi.channels) {
      for (let num in midi.channels[ch].activeNotes) {
        notes[num] = midi.channels[ch].activeNotes[num];
      }
    }
    return notes;
  }),
  guessChords: computed(() => {
    const list = Object.keys(midi.activeNotes).map(n => Midi.midiToNoteName(Number(n), { sharps: true }));
    return list.length > 2 ? Chord.detect(list) : [];
  }),
  activeChroma: computed(() => {
    let chroma = new Array(12).fill(0);
    for (let num in midi.activeNotes) {
      const n = (Number(num) - 9) % 12;
      chroma[n] = midi.activeNotes[num];
    }
    return chroma.join('');
  }),
  activeChromaMidi: computed(() => {
    let chroma = new Array(12).fill(0);
    for (let num in midi.activeNotes) {
      const n = (Number(num) - 9) % 12;
      chroma[n] = num;
    }
    return chroma;
  }),
  stopAll,
  attack: midiAttack,
  release: midiRelease,
  once: midiOnce,
  setCC
});

export function learnCC({ number, channel }) {
  const val = ref(0);
  watch(() => midi.cc, cc => {
    if (channel && cc.channel != channel)
      return;
    if (number == cc.number)
      val.value = cc.value;
  });
  return val;
}

export function playKey(name = 'A', offset = 0, off = false, velocity = 1, duration) {
  let noteName = name + (4 + offset + midi.offset);
  const note = new Note(noteName, {
    attack: off ? 0 : velocity,
    release: off ? 0 : velocity,
    duration
  });
  const ev = {
    type: off ? "noteoff" : "noteon",
    note,
    port: { id: "PC Keyboard" },
    timestamp: midi.time,
    target: { number: 0 },
    channel: 0,
    message: {}
  };
  noteInOn(ev);
}

export function useMidi() {

  if (!midi.initiated) {
    onMounted(() => {
      setupKeyboard();
      setupMidi();
    });
    watchEffect(() => {
      if (!midi.out)
        return;
      let outs = Object.values(WebMidi.outputs);
      if (midi.playing) {
        outs.forEach((output) => {
          output.sendContinue();
        });
      }
      else {
        outs.forEach((output) => {
          output.sendStop();
        });
      }
    });
    midi.stopped = false;
    midi.initiated = true;
  }
  return {
    midi,
    midiAttack,
    midiRelease,
    midiOnce,
    setCC,
    midiPlay,
    midiStop,
    playKey,
    stopAll
  };
}

function setupMidi() {
  WebMidi.enable();
  if (!WebMidi.supported) return

  WebMidi.addListener("enabled", () => {
    midi.enabled = true;
    initMidi();
  });
  // let interval = setInterval(() => {
  //   initMidi();
  // }, 3000);
  WebMidi.addListener("connected", (ev) => {
    initMidi();
  });
  WebMidi.addListener("disconnected", (e) => {
    delete midi[e.port.type + "s"][e.port.id];
  });
  midi.initiated = true;
}

function initMidi() {
  midi.inputs = shallowReactive({});
  midi.enabled = true;
  WebMidi.inputs.forEach((input) => {
    midi.inputs[input.id] = {
      name: input.name,
      manufacturer: input.manufacturer,
      forwarder: input.addForwarder(),
      clock: 0,
      event: null,
      note: null,
      cc: null,
    };
    input.removeListener();
    input.addListener("start", () => {
      midi.playing = true;
      midi.stopped = false;
    });
    input.addListener("stop", () => {
      midi.playing = false;
      midi.stopped = Date.now();
    });
    const diffs = [];
    const avg = Ola({ value: 15 });
    input.addListener('clock', ev => {
      const diff = ev.timestamp - midi.inputs[input.id].clock;
      diffs.push(diff);
      if (diffs.length > 50)
        diffs.shift();
      avg.value = diffs.reduce((acc, d) => acc + d, 0) / diffs.length;
      midi.inputs[input.id].diff = avg.value;
      midi.inputs[input.id].bpm = (1000 / avg.value / 24) * 60;
      midi.inputs[input.id].clock = ev.timestamp;
    });
    input.addListener("midimessage", (ev) => {
      var _a;
      if (((_a = ev === null || ev === void 0 ? void 0 : ev.message) === null || _a === void 0 ? void 0 : _a.type) == "clock")
        return;
      midi.inputs[input.id].event = ev;
      midi.message = ev.message;
      midi.log.unshift(ev);
      if (midi.log.length > 100)
        midi.log.pop();
    });
    input.addListener("noteon", (ev) => {
      midi.inputs[input.id].note = noteInOn(ev);
    });
    input.addListener("noteoff", (ev) => {
      midi.inputs[input.id].note = noteInOn(ev);
    });
    input.addListener("controlchange", (ev) => {
      const cc = ccIn(ev);
      if (!cc)
        return;
      midi.inputs[input.id].cc = cc;
      midi.cc = cc;
    });
    input.addListener("clock", (ev) => {
      midi.clock = ev.timestamp;
      //bpm = 60000 / ((ev.timestamp - prevTimestamp) * PPQ)  ppq=24
    });
  });
  midi.outputs = shallowReactive({});
  WebMidi.outputs.forEach((output) => {
    midi.outputs[output.id] = {
      name: output.name,
      manufacturer: output.manufacturer,
    };
  });
}


function noteInOn(ev) {
  const note = {
    ...ev.note,
    port: ev.port.id,
    type: ev.type,
    timestamp: ev.timestamp,
    //@ts-expect-error type bug?
    channel: ev.target.number,
    velocity: 0,
    number: ev.note.number,
    pitch: (ev.note.number + 3) % 12,
    octA: Math.floor((ev.note.number + 3) / 12) - 1,
  };
  if (midi.filter[note.channel])
    return;
  createMidiChannel(note.channel);
  midi.channels[note.channel].notes[note.number] = note;
  if (ev.type == "noteoff") {
    note.velocity = 0;
    delete midi.channels[note.channel].activeNotes[note.number];
  }
  else {
    note.velocity = 120 * (ev.note.attack || 1);
    midi.channels[note.channel].activeNotes[note.number] = ev.note.attack;
  }
  midi.note = note;
  return note;
}


function ccIn(ev) {
  if (midi.filter[ev.message.channel])
    return;
  let cc = {
    channel: ev.message.channel,
    timestamp: ev.timestamp,
    number: ev.controller.number,
    value: Number(ev.value),
    raw: ev.rawValue,
    port: ev.port.id,
  };
  createMidiChannel(cc.channel);
  midi.channels[cc.channel].cc[cc.number] = cc;
  return cc;
}


function createMidiChannel(ch) {
  if (!midi.channels[ch]) {
    midi.channels[ch] = reactive({ num: ch, activeNotes: {}, notes: {}, cc: {} });
  }
}


function setVelocity(channel, note, velocity) {
  var _a, _b, _c;
  if ((_c = (_b = (_a = midi.channels) === null || _a === void 0 ? void 0 : _a[channel]) === null || _b === void 0 ? void 0 : _b.notes) === null || _c === void 0 ? void 0 : _c[note]) {
    midi.channels[channel].notes[note].velocity = velocity;
  }
}

export function midiAttack(note, options) {
  if (!midi.out)
    return;
  let channel = (note === null || note === void 0 ? void 0 : note.channel) || midi.channel;
  setVelocity(channel, note?.number, 100);
  WebMidi.outputs.forEach((output) => {
    output.playNote(note.number, {
      channels: channel,
      ...options,
    });
  });
}


export function midiPlay(note, options) {
  if (!midi.out)
    return;
  WebMidi.outputs.forEach((output) => {
    output.playNote(note, {
      channels: midi.channel,
      ...options,
    });
  });
}


export function midiStop(note, options) {
  if (!midi.out)
    return;
  if (note) {
    WebMidi.outputs.forEach((output) => {
      output.stopNote(note, { channels: midi.channel, ...options });
    });
  }
  else {
    WebMidi.outputs.forEach((output) => {
      output.sendAllNotesOff();
      output.sendAllSoundOff({ time: "+1" });
    });
    midi.stopped = true;
  }
}


export function midiRelease(note) {
  if (!midi.out)
    return;
  if (note) {
    let channel = (note === null || note === void 0 ? void 0 : note.channel) || midi.channel;
    setVelocity(channel, note === null || note === void 0 ? void 0 : note.number, 0);
    WebMidi.outputs.forEach((output) => {
      output.stopNote(note.number, { channels: channel });
    });
  }
  else {
    WebMidi.outputs.forEach((output) => {
      output.sendAllNotesOff();
      output.sendAllSoundOff({ time: "+1" });
    });
  }
}


export function midiOnce(note, options) {
  if (!midi.out || midi.filter[midi.channel])
    return;
  midiPlay(note, options);
  setTimeout(() => {
    midiStop(note, options);
  }, 300);
}
export function setCC(cc, value) {
  if (!midi.out)
    return;
  WebMidi.outputs.forEach((output) => {
    output.sendControlChange(Number(cc.number), value, cc.channel);
  });
}


export function stopAll() {
  if (!midi.out)
    return;
  midi.channels = {};
  midi.playing = false;
  WebMidi.outputs.forEach((output) => {
    output.sendAllNotesOff();
    output.sendAllSoundOff();
    output.sendReset();
    output.sendSongPosition(0);
  });
  midi.stopped = true;
}


/**
 * Sets a forwarding route from an Input to an Output
 * @param iid Input ID
 * @param oid Output ID
 */
export function forwardMidi(iid, oid) {
  console.log(iid, oid)
  var _a, _b;
  const output = WebMidi.outputs.find((out) => out.id == oid);
  const destinations = midi.inputs[iid].forwarder.destinations;
  const index = destinations.indexOf(output);
  if (index == -1) {
    destinations.push(output);
    midi.forwards[iid] = midi.forwards[iid] || {};
    midi.forwards[iid][oid] = true;
  }
  else {
    destinations.splice(index, 1);
    (_b = (_a = midi.forwards) === null || _a === void 0 ? void 0 : _a[iid]) === null || _b === void 0 ? true : delete _b[oid];
  }
}


export function sortNotes(notes, reverse = false) {
  if (!notes)
    return [];
  let arr = Object.values(notes);
  return arr.sort((a, b) => {
    let diff = a.number > b.number ? -1 : 1;
    if (reverse) {
      diff *= -1;
    }
    return diff;
  });
}
